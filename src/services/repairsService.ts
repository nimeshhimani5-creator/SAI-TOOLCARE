import { 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { RepairJob, RepairStatus, RepairTimelineEvent } from '../types';
import { SAMPLE_REPAIRS } from '../data/mockData';

const LOCAL_REPAIRS_KEY = 'toolcare_repairs_v1';
const repairsChannel = typeof window !== 'undefined' ? new BroadcastChannel('toolcare_repairs_bus') : null;

const STATUS_ORDER: RepairStatus[] = [
  'requested',
  'received_at_shop',
  'inspection',
  'awaiting_customer_approval',
  'approved',
  'in_progress',
  'ready_for_collection',
  'completed'
];

const STATUS_LABELS: { [key in RepairStatus]: string } = {
  requested: 'Request Submitted',
  received_at_shop: 'Received at Shop Counter',
  inspection: 'Diagnostic Inspection',
  awaiting_customer_approval: 'Awaiting Customer Approval',
  approved: 'Estimate Approved',
  in_progress: 'Repair in Progress',
  ready_for_collection: 'Ready for Counter Collection',
  completed: 'Collected & Tested'
};

export const repairsService = {
  // Subscribe to real-time repairs updates
  subscribeToRepairs(callback: (repairs: { [key: string]: RepairJob }) => void) {
    if (isFirebaseConfigured && db) {
      const colRef = collection(db, 'repairs');

      // Seed sample repairs if empty
      getDocs(colRef).then((snapshot) => {
        if (snapshot.empty) {
          console.log('[ToolCare Cloud] Seeding initial repair tickets to Firestore...');
          Object.values(SAMPLE_REPAIRS).forEach((job) => {
            setDoc(doc(db!, 'repairs', job.referenceId), job);
          });
        }
      });

      return onSnapshot(colRef, (snapshot) => {
        const dict: { [key: string]: RepairJob } = {};
        snapshot.forEach((d) => {
          const data = d.data() as RepairJob;
          dict[data.referenceId] = data;
        });
        if (Object.keys(dict).length > 0) {
          callback(dict);
        } else {
          callback(SAMPLE_REPAIRS);
        }
      }, (err) => {
        console.warn('Firestore repairs subscription error, fallback to local:', err);
        callback(this.loadLocalRepairs());
      });
    }

    // Local reactive storage mode
    const initialDict = this.loadLocalRepairs();
    callback(initialDict);

    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'REPAIRS_CHANGE') {
        callback(this.loadLocalRepairs());
      }
    };

    repairsChannel?.addEventListener('message', handleMessage);
    return () => {
      repairsChannel?.removeEventListener('message', handleMessage);
    };
  },

  loadLocalRepairs(): { [key: string]: RepairJob } {
    const stored = localStorage.getItem(LOCAL_REPAIRS_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
          return parsed;
        }
      } catch {
        // Fallback
      }
    }
    localStorage.setItem(LOCAL_REPAIRS_KEY, JSON.stringify(SAMPLE_REPAIRS));
    return SAMPLE_REPAIRS;
  },

  // Create a new repair ticket in real-time
  async createRepairJob(job: RepairJob): Promise<void> {
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'repairs', job.referenceId), job);
        return;
      } catch (err) {
        console.warn('Firestore failed to write repair job, writing locally:', err);
      }
    }

    const dict = this.loadLocalRepairs();
    dict[job.referenceId] = job;
    localStorage.setItem(LOCAL_REPAIRS_KEY, JSON.stringify(dict));
    repairsChannel?.postMessage({ type: 'REPAIRS_CHANGE' });
  },

  // Assign a technician to a repair ticket
  async assignTechnician(referenceId: string, technicianName: string): Promise<void> {
    return this.updateRepairStatus(referenceId, 'received_at_shop', `Assigned to technician ${technicianName}`, technicianName);
  },

  // Technician submits diagnostic inspection findings & estimate
  async submitDiagnosticEstimate(
    referenceId: string, 
    diagnosticFindings: string, 
    estimatedCost: number, 
    partsNeeded?: string[]
  ): Promise<void> {
    const formattedNotes = `Diagnosis: ${diagnosticFindings}. Parts: ${partsNeeded?.join(', ') || 'Standard service'}. Estimate: ₹${estimatedCost}`;
    return this.updateRepairStatus(
      referenceId, 
      'awaiting_customer_approval', 
      formattedNotes, 
      undefined, 
      estimatedCost,
      diagnosticFindings,
      partsNeeded
    );
  },

  // Update repair status & synchronize timeline
  async updateRepairStatus(
    referenceId: string, 
    newStatus: RepairStatus, 
    notes?: string,
    technicianName?: string,
    estimate?: number,
    diagnosticFindings?: string,
    partsNeeded?: string[]
  ): Promise<void> {
    const currentTimestamp = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });

    const targetIdx = STATUS_ORDER.indexOf(newStatus);

    if (isFirebaseConfigured && db) {
      try {
        const jobRef = doc(db, 'repairs', referenceId);
        const updates: any = {
          status: newStatus,
          statusLabel: STATUS_LABELS[newStatus],
          ...(technicianName && { technicianName }),
          ...(estimate !== undefined && { estimatedCost: estimate }),
          ...(diagnosticFindings && { diagnosticFindings }),
          ...(partsNeeded && { partsNeeded })
        };
        if (newStatus === 'completed') {
          updates.completedAt = new Date().toISOString();
        }
        await updateDoc(jobRef, updates);
        return;
      } catch (err) {
        console.warn('Firestore update error, updating locally:', err);
      }
    }

    const dict = this.loadLocalRepairs();
    const job = dict[referenceId];
    if (job) {
      job.status = newStatus;
      job.statusLabel = STATUS_LABELS[newStatus];
      if (technicianName) job.technicianName = technicianName;
      if (estimate !== undefined) job.estimatedCost = estimate;
      if (diagnosticFindings) job.diagnosticFindings = diagnosticFindings;
      if (partsNeeded) job.partsNeeded = partsNeeded;
      if (newStatus === 'completed') job.completedAt = new Date().toISOString();

      // Synchronize timeline events
      job.timeline = job.timeline.map((event) => {
        const eventIdx = STATUS_ORDER.indexOf(event.status);
        if (eventIdx <= targetIdx) {
          return {
            ...event,
            completed: true,
            timestamp: event.completed && event.timestamp !== 'Pending' ? event.timestamp : currentTimestamp,
            notes: event.status === newStatus ? (notes || event.notes) : event.notes
          };
        }
        return event;
      });

      dict[referenceId] = job;
      localStorage.setItem(LOCAL_REPAIRS_KEY, JSON.stringify(dict));
      repairsChannel?.postMessage({ type: 'REPAIRS_CHANGE' });
    }
  }
};
