import React, { useState, useMemo } from 'react';
import { 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Send, 
  Search, 
  CheckSquare, 
  ShieldCheck, 
  X,
  Phone,
  FileText,
  DollarSign,
  Printer,
  Share2
} from 'lucide-react';
import { RepairJob, RepairStatus, UserProfile } from '../types';
import { adminBackendService } from '../services/adminBackendService';
import { whatsappService } from '../utils/whatsapp';

interface TechnicianPortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  repairs: { [key: string]: RepairJob };
  onShowToast: (msg: string) => void;
}

export const TechnicianPortal: React.FC<TechnicianPortalProps> = ({
  isOpen,
  onClose,
  currentUser,
  repairs,
  onShowToast
}) => {
  const [filterMode, setFilterMode] = useState<'my_jobs' | 'all'>('my_jobs');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  // Diagnostic form state
  const [findings, setFindings] = useState('');
  const [estimateInput, setEstimateInput] = useState<number | ''>('');
  const [partsInput, setPartsInput] = useState('');

  const repairList = useMemo(() => {
    return Object.values(repairs);
  }, [repairs]);

  // Filter list with fast 10-digit phone, customer name, ticket ID search
  const filteredJobs = useMemo(() => {
    return repairList.filter((job) => {
      const isMyJob = filterMode === 'all' || 
        (job.technicianName && job.technicianName.toLowerCase().includes(currentUser.displayName.toLowerCase().split(' ')[0]));
      
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !searchQuery ||
        job.referenceId.toLowerCase().includes(q) ||
        job.customerName.toLowerCase().includes(q) ||
        job.phone.toLowerCase().includes(q) ||
        job.toolType.toLowerCase().includes(q) ||
        job.brandModel.toLowerCase().includes(q);

      return isMyJob && matchesSearch;
    });
  }, [repairList, filterMode, searchQuery, currentUser.displayName]);

  // Selected job
  const selectedJob = useMemo(() => {
    if (!selectedJobId) {
      return filteredJobs.length > 0 ? filteredJobs[0] : null;
    }
    return repairs[selectedJobId] || null;
  }, [selectedJobId, filteredJobs, repairs]);

  if (!isOpen) return null;

  // Handle technician selecting a job to inspect
  const handleSelectJob = (job: RepairJob) => {
    setSelectedJobId(job.referenceId);
    setFindings(job.diagnosticFindings || '');
    setEstimateInput(job.estimatedCost || '');
    setPartsInput(job.partsNeeded ? job.partsNeeded.join(', ') : '');
  };

  // Submit diagnostic estimate
  const handleSubmitEstimate = async () => {
    if (!selectedJob) return;
    if (!estimateInput || Number(estimateInput) <= 0) {
      onShowToast('Please enter a valid repair cost estimate in ₹.');
      return;
    }
    if (!findings.trim()) {
      onShowToast('Please enter your diagnostic findings.');
      return;
    }

    const parts = partsInput
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);

    try {
      await adminBackendService.submitDiagnosticFindings(
        selectedJob.referenceId,
        findings.trim(),
        Number(estimateInput),
        parts
      );
      onShowToast(`Diagnostic estimate of ₹${estimateInput} submitted for ${selectedJob.referenceId}!`);
    } catch (err) {
      onShowToast(`Failed to submit estimate: ${err}`);
    }
  };

  // Advance status handler
  const handleAdvanceStatus = async (newStatus: RepairStatus, notes?: string) => {
    if (!selectedJob) return;
    try {
      await adminBackendService.advanceRepairStatus(
        selectedJob.referenceId,
        newStatus,
        notes,
        currentUser.displayName
      );
      onShowToast(`Ticket ${selectedJob.referenceId} updated to ${newStatus.replace(/_/g, ' ')}!`);
    } catch (err) {
      onShowToast(`Failed to update status: ${err}`);
    }
  };

  const handlePrintSlip = (job: RepairJob) => {
    const printWindow = window.open('', '_blank', 'width=750,height=850');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bench Job Slip - ${job.referenceId} - Om Sai Power Tools</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #111; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 12px; margin-bottom: 16px; }
            .shop-title { font-size: 20px; font-weight: 900; text-transform: uppercase; margin: 0; color: #131921; }
            .shop-sub { font-size: 11px; color: #444; margin-top: 3px; }
            .badge-row { margin: 10px 0; }
            .ticket-badge { display: inline-block; background: #ff9900; color: #111; font-weight: 900; font-size: 16px; padding: 4px 12px; border-radius: 4px; }
            .grid { display: table; width: 100%; margin-top: 14px; border-collapse: collapse; }
            .row { display: table-row; }
            .cell-label { display: table-cell; width: 35%; font-weight: 700; padding: 6px 4px; border-bottom: 1px solid #ddd; font-size: 13px; }
            .cell-val { display: table-cell; padding: 6px 4px; border-bottom: 1px solid #ddd; font-size: 13px; }
            .highlight-box { background: #f8f9fa; border: 1px solid #ccc; border-radius: 6px; padding: 10px; margin: 16px 0; font-size: 12px; }
            .sign-row { display: table; width: 100%; margin-top: 35px; }
            .sign-col { display: table-cell; width: 50%; text-align: center; font-size: 12px; border-top: 1px solid #333; padding-top: 6px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="shop-title">OM SAI POWER TOOLS AND REPAIRING CENTER</h1>
            <p class="shop-sub">Station Road Counter, Opp. ST Bus Depot, Main Market &bull; Mob: +91 80774 66755</p>
            <div class="badge-row">
              <span class="ticket-badge">JOB CARD # ${job.referenceId}</span>
            </div>
            <p style="font-size: 12px; margin: 2px 0;">Received Date: <strong>${job.submittedAt}</strong> &bull; Technician: <strong>${job.technicianName || 'Workshop Bench'}</strong></p>
          </div>

          <div class="grid">
            <div class="row"><div class="cell-label">Customer Name:</div><div class="cell-val"><strong>${job.customerName}</strong></div></div>
            <div class="row"><div class="cell-label">Mobile Number:</div><div class="cell-val"><strong>${job.phone}</strong></div></div>
            <div class="row"><div class="cell-label">Tool & Model:</div><div class="cell-val"><strong>${job.toolType}</strong> &bull; ${job.brandModel}</div></div>
            <div class="row"><div class="cell-label">Issue Reported:</div><div class="cell-val">${job.issueDescription}</div></div>
            <div class="row"><div class="cell-label">Estimated Cost:</div><div class="cell-val"><strong>${job.estimatedCost ? '₹' + job.estimatedCost : 'Inspection Pending'}</strong></div></div>
            <div class="row"><div class="cell-label">Current Status:</div><div class="cell-val">${job.statusLabel}</div></div>
          </div>

          <div class="highlight-box">
            <strong>Shop Counter Terms:</strong><br/>
            1. Present this slip or WhatsApp confirmation when collecting your tool.<br/>
            2. Test machine under full counter load before final payment.<br/>
            3. 100% genuine copper coil rewinding with 30-day testing guarantee.
          </div>

          <div class="sign-row">
            <div class="sign-col" style="padding-right: 15px;">Customer Signature</div>
            <div class="sign-col" style="padding-left: 15px;">Shop In-Charge / Mechanic (Om Sai Power Tools)</div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="admin-portal-overlay">
      <div className="admin-portal-modal tech-workbench-modal">
        {/* Header Bar */}
        <div className="admin-modal-header">
          <div className="admin-header-title">
            <div className="admin-badge-icon tech-icon-badge">
              <Wrench size={22} className="text-amber-500" />
            </div>
            <div>
              <h2>Technician Repair Bench & Diagnostics</h2>
              <p className="admin-subtitle">
                Om Sai Power Tools Workshop &bull; Certified Technician: <strong>{currentUser.displayName}</strong>
              </p>
            </div>
          </div>
          <button className="admin-close-btn" onClick={onClose} aria-label="Close Technician Portal">
            <X size={22} />
          </button>
        </div>

        {/* Workbench Body */}
        <div className="tech-workbench-layout">
          {/* Left Column: Job Queue */}
          <div className="tech-queue-column">
            <div className="tech-queue-header">
              <div className="tech-filter-toggle">
                <button 
                  className={`toggle-btn ${filterMode === 'my_jobs' ? 'active' : ''}`}
                  onClick={() => setFilterMode('my_jobs')}
                >
                  My Jobs ({repairList.filter(j => j.technicianName?.includes(currentUser.displayName.split(' ')[0])).length})
                </button>
                <button 
                  className={`toggle-btn ${filterMode === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterMode('all')}
                >
                  All Workshop Jobs ({repairList.length})
                </button>
              </div>

              <div className="tech-search-input">
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Filter ticket or tool..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="tech-job-cards-list">
              {filteredJobs.length === 0 ? (
                <div className="empty-tech-card">
                  <p>No repair jobs assigned matching this filter.</p>
                </div>
              ) : (
                filteredJobs.map((job) => {
                  const isSelected = selectedJob?.referenceId === job.referenceId;
                  return (
                    <div 
                      key={job.referenceId}
                      className={`tech-job-item ${isSelected ? 'selected' : ''} status-${job.status}`}
                      onClick={() => handleSelectJob(job)}
                    >
                      <div className="job-item-top">
                        <span className="job-ref-tag">{job.referenceId}</span>
                        <span className={`status-pill status-${job.status}`}>
                          {job.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <div className="job-tool-title">
                        {job.toolType} &bull; {job.brandModel}
                      </div>
                      <div className="job-customer-brief">
                        Cust: {job.customerName}
                      </div>
                      <div className="job-tech-assigned">
                        👨‍🔧 {job.technicianName || 'Unassigned'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Diagnostic & Inspection Workbench */}
          <div className="tech-bench-column">
            {selectedJob ? (
              <div className="tech-bench-panel">
                {/* Active Ticket Banner */}
                <div className="bench-ticket-banner">
                  <div>
                    <span className="bench-ref-number">{selectedJob.referenceId}</span>
                    <h3 className="bench-tool-heading">{selectedJob.toolType} &bull; {selectedJob.brandModel}</h3>
                    <p className="bench-customer-line">
                      Customer: <strong>{selectedJob.customerName}</strong> ({selectedJob.phone}) &bull; Booked on {selectedJob.submittedAt}
                    </p>
                  </div>
                  <div className="bench-header-right">
                    <span className={`status-badge status-${selectedJob.status}`}>
                      {selectedJob.statusLabel}
                    </span>
                    <div className="bench-actions-strip">
                      <button 
                        type="button" 
                        className="btn btn-xs btn-outline"
                        onClick={() => handlePrintSlip(selectedJob)}
                        title="Print Counter Job Slip for Bench"
                      >
                        <Printer size={13} />
                        <span>🖨️ Print Job Slip</span>
                      </button>

                      {selectedJob.status === 'ready_for_collection' && (
                        <a 
                          href={whatsappService.getToolReadyAlertUrl(selectedJob)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-xs btn-whatsapp-alert"
                          title="Alert Customer on WhatsApp: Tool Ready for Pickup"
                        >
                          <Share2 size={13} />
                          <span>📲 WhatsApp: Tool Ready</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Customer Reported Problem */}
                <div className="bench-section-card">
                  <div className="section-title-wrap">
                    <AlertCircle size={16} className="text-amber-500" />
                    <h4>Customer Reported Complaint</h4>
                  </div>
                  <div className="complaint-quote-box">
                    "{selectedJob.issueDescription}"
                  </div>
                  {selectedJob.imageUrl && (
                    <div className="tool-photo-preview">
                      <span className="text-xs text-muted">Customer attached tool photo:</span>
                      <img src={selectedJob.imageUrl} alt="Inspection Tool" className="photo-thumb" />
                    </div>
                  )}
                </div>

                {/* Technician Diagnostic Form */}
                <div className="bench-section-card">
                  <div className="section-title-wrap">
                    <Wrench size={16} className="text-amber-500" />
                    <h4>Bench Diagnostic & Estimate Formulation</h4>
                  </div>

                  <div className="bench-form-grid">
                    <div className="bench-field full-width">
                      <label>Diagnostic Inspection Findings & Root Cause</label>
                      <textarea 
                        rows={3}
                        placeholder="e.g., Heavy sparking detected. Armature commutator grooved & 2 coils open. Field coils healthy. Bearings noisy, need 608RS replacement."
                        value={findings}
                        onChange={(e) => setFindings(e.target.value)}
                      />
                    </div>

                    <div className="bench-field">
                      <label>Total Repair Cost Estimate (₹)</label>
                      <div className="input-with-currency">
                        <span className="currency-symbol">₹</span>
                        <input 
                          type="number" 
                          placeholder="e.g. 750" 
                          value={estimateInput}
                          onChange={(e) => setEstimateInput(e.target.value === '' ? '' : Number(e.target.value))}
                        />
                      </div>
                    </div>

                    <div className="bench-field">
                      <label>Replacement Parts Required</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Pure Copper Armature, Carbon Brush Set" 
                        value={partsInput}
                        onChange={(e) => setPartsInput(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="bench-submit-estimate-row">
                    <button 
                      className="btn btn-primary"
                      onClick={handleSubmitEstimate}
                    >
                      <Send size={15} />
                      <span>Submit Quote to Customer (Awaiting Approval)</span>
                    </button>
                    <span className="text-xs text-muted">
                      Saves estimate to real-time database and customer tracking timeline.
                    </span>
                  </div>
                </div>

                {/* Workflow Status Progression Controls */}
                <div className="bench-section-card">
                  <div className="section-title-wrap">
                    <CheckSquare size={16} className="text-emerald-500" />
                    <h4>Progress Tool Across Workshop Stages</h4>
                  </div>

                  <div className="status-flow-buttons">
                    <button 
                      className={`flow-btn ${selectedJob.status === 'inspection' ? 'current' : ''}`}
                      onClick={() => handleAdvanceStatus('inspection', 'Tool dismantled and placed on test bench for multimeter testing.')}
                    >
                      1. Start Inspection
                    </button>

                    <button 
                      className={`flow-btn ${selectedJob.status === 'awaiting_customer_approval' ? 'current' : ''}`}
                      onClick={() => handleAdvanceStatus('awaiting_customer_approval', 'Estimate quoted, waiting for customer sign-off.')}
                    >
                      2. Awaiting Approval
                    </button>

                    <button 
                      className={`flow-btn ${selectedJob.status === 'in_progress' ? 'current' : ''}`}
                      onClick={() => handleAdvanceStatus('in_progress', 'Parts fitted: new pure copper armature wound, bearings lubricated.')}
                    >
                      3. Repair in Progress
                    </button>

                    <button 
                      className={`flow-btn btn-highlight ${selectedJob.status === 'ready_for_collection' ? 'current' : ''}`}
                      onClick={() => handleAdvanceStatus('ready_for_collection', 'Bench load-tested with ampere meter. Running at 11,000 RPM smoothly. Ready at shop counter!')}
                    >
                      4. Bench Tested & Ready for Pickup
                    </button>

                    <button 
                      className={`flow-btn ${selectedJob.status === 'completed' ? 'current' : ''}`}
                      onClick={() => handleAdvanceStatus('completed', 'Tested in front of customer at shop counter and collected.')}
                    >
                      5. Completed & Handed Over
                    </button>
                  </div>

                  {selectedJob.status === 'ready_for_collection' && (
                    <div className="bench-ready-whatsapp-callout">
                      <div className="callout-text">
                        <strong>✅ Tool is bench load-tested & ready!</strong> Send instant WhatsApp alert to customer <strong>{selectedJob.customerName}</strong> ({selectedJob.phone}):
                      </div>
                      <a 
                        href={whatsappService.getToolReadyAlertUrl(selectedJob)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-whatsapp-action"
                      >
                        <Share2 size={15} />
                        <span>📲 WhatsApp: "Tool Ready for Collection" ({selectedJob.phone})</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Timeline Audit Review */}
                <div className="bench-section-card">
                  <div className="section-title-wrap">
                    <Clock size={16} className="text-amber-500" />
                    <h4>Job History Timeline Audit</h4>
                  </div>

                  <div className="tech-timeline-stream">
                    {selectedJob.timeline.map((event, idx) => (
                      <div key={idx} className={`timeline-entry ${event.completed ? 'completed' : 'pending'}`}>
                        <div className="timeline-node">
                          {event.completed ? '✓' : '○'}
                        </div>
                        <div className="timeline-info">
                          <div className="timeline-title-row">
                            <strong>{event.label}</strong>
                            <span className="timeline-time">{event.timestamp}</span>
                          </div>
                          {event.notes && (
                            <div className="timeline-notes-text">{event.notes}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="no-selection-placeholder">
                <Wrench size={40} className="text-muted" />
                <h3>No Repair Job Selected</h3>
                <p>Select a tool from the queue on the left to start diagnostic inspection.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
