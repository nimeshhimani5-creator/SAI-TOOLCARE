import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  MapPin, 
  Phone, 
  Wrench, 
  User, 
  Printer,
  Share2,
  QrCode,
  Check,
  FileText
} from 'lucide-react';
import { RepairJob, InvoiceData } from '../types';
import { whatsappService } from '../utils/whatsapp';
import { CounterUpiModal } from './CounterUpiModal';
import { SHOP_INFO } from '../data/mockData';

interface TrackRepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  repairDatabase: { [key: string]: RepairJob };
  initialTicketId?: string;
  onOpenInvoice?: (invoice: InvoiceData) => void;
}

export const TrackRepairModal: React.FC<TrackRepairModalProps> = ({
  isOpen,
  onClose,
  repairDatabase,
  initialTicketId = '',
  onOpenInvoice
}) => {
  const [ticketInput, setTicketInput] = useState(initialTicketId || 'REP-1001');
  const [activeJob, setActiveJob] = useState<RepairJob | null>(null);
  const [searched, setSearched] = useState(false);
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);

  const findAndSetJob = useCallback((queryStr: string) => {
    const raw = queryStr.trim().toLowerCase();
    if (!raw) {
      setActiveJob(null);
      setSearched(false);
      return;
    }

    const cleanDigits = raw.replace(/[^0-9]/g, '');

    // Search by exact ID, or substring of phone, or customer name
    const found = Object.values(repairDatabase).find((job) => {
      const matchId = job.referenceId.toLowerCase() === raw;
      const matchPhone = cleanDigits.length >= 4 && job.phone.replace(/[^0-9]/g, '').includes(cleanDigits);
      const matchName = job.customerName.toLowerCase().includes(raw);
      return matchId || matchPhone || matchName;
    });

    setActiveJob(found || null);
    setSearched(true);
  }, [repairDatabase]);

  useEffect(() => {
    if (initialTicketId) {
      setTicketInput(initialTicketId);
      findAndSetJob(initialTicketId);
    } else if (repairDatabase['REP-1001']) {
      setActiveJob(repairDatabase['REP-1001']);
      setSearched(true);
    }
  }, [initialTicketId, repairDatabase, isOpen, findAndSetJob]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    findAndSetJob(ticketInput);
  };

  const selectSample = (id: string) => {
    setTicketInput(id);
    findAndSetJob(id);
  };

  const handlePrintSlip = () => {
    if (!activeJob) return;

    const printWindow = window.open('', '_blank', 'width=750,height=850');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Repair Intake Slip - ${activeJob.referenceId} - Om Sai Power Tools</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; padding: 24px; color: #111; line-height: 1.4; }
            .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 12px; margin-bottom: 16px; }
            .shop-title { font-size: 20px; font-weight: 900; text-transform: uppercase; margin: 0; color: #131921; }
            .shop-sub { font-size: 11px; color: #444; margin-top: 3px; }
            .badge-row { margin: 10px 0; }
            .ticket-badge { font-size: 16px; font-weight: 800; background: #fef3c7; color: #92400e; padding: 6px 16px; border-radius: 4px; display: inline-block; border: 1.5px solid #f59e0b; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; font-size: 12px; margin-bottom: 16px; }
            .grid-item strong { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; }
            .box { border: 1px solid #cbd5e1; background: #f8fafc; padding: 10px; border-radius: 6px; font-size: 12px; margin-bottom: 14px; }
            .box-title { font-weight: 700; color: #1e293b; margin-bottom: 4px; font-size: 11px; text-transform: uppercase; }
            .estimate-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; background: #e0f2fe; padding: 8px 12px; border-radius: 6px; border: 1px solid #bae6fd; margin-bottom: 16px; }
            .policy { font-size: 10px; color: #475569; border-top: 1px solid #cbd5e1; padding-top: 10px; margin-top: 20px; }
            .policy ol { margin: 4px 0; padding-left: 18px; }
            .sign-row { display: flex; justify-content: space-between; margin-top: 35px; font-size: 11px; padding-top: 10px; }
            .sign-box { border-top: 1px solid #333; width: 220px; text-align: center; padding-top: 4px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="shop-title">OM SAI POWER TOOLS AND REPAIRING CENTER</h1>
            <div class="shop-sub">Shop No. 4, Sai Complex, Station Road, Opp. Bus Depot, Industrial Area • Phone: +91 80774 66755</div>
            <div class="shop-sub"><strong>Founder &amp; Owner: Himani</strong> • 100% Pure Copper Armatures &amp; Genuine Spares</div>
            <div class="badge-row">
              <span class="ticket-badge">REPAIR JOB SLIP: ${activeJob.referenceId}</span>
            </div>
          </div>

          <div class="grid">
            <div class="grid-item">
              <strong>Customer Name:</strong>
              ${activeJob.customerName}
            </div>
            <div class="grid-item">
              <strong>Mobile Number:</strong>
              ${activeJob.phone}
            </div>
            <div class="grid-item">
              <strong>Tool Type:</strong>
              ${activeJob.toolType}
            </div>
            <div class="grid-item">
              <strong>Brand &amp; Model:</strong>
              ${activeJob.brandModel}
            </div>
            <div class="grid-item">
              <strong>Technician Assigned:</strong>
              ${activeJob.technicianName || 'Diagnostic Workbench'}
            </div>
            <div class="grid-item">
              <strong>Intake Status:</strong>
              ${activeJob.statusLabel}
            </div>
          </div>

          <div class="box">
            <div class="box-title">Reported Fault / Symptoms:</div>
            ${activeJob.issueDescription}
          </div>

          <div class="estimate-row">
            <span>Approved Estimate: ${activeJob.estimatedCost ? `₹${activeJob.estimatedCost.toLocaleString('en-IN')}` : 'Pending Bench Diagnostic'}</span>
            <span>Advance Paid: ₹0 (Counter Settlement Only)</span>
          </div>

          <div class="policy">
            <strong>Workshop Intake Guarantee &amp; Terms:</strong>
            <ol>
              <li>Customers must present this physical slip or SMS/WhatsApp ticket to collect tools from the Station Road counter.</li>
              <li>Every repaired tool is tested on our physical load bench (current meter and test block) in your presence before payment.</li>
              <li>We guarantee 100% pure electrolytic copper wire windings for all replaced armatures and coils.</li>
            </ol>
          </div>

          <div class="sign-row">
            <div class="sign-box">Customer Signature</div>
            <div class="sign-box">Authorized Counter Seal (Himani)</div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleOpenWhatsApp = () => {
    if (!activeJob) return;
    const url = whatsappService.getRepairBookingSlipUrl(
      activeJob.referenceId,
      activeJob.customerName,
      activeJob.toolType,
      activeJob.brandModel,
      activeJob.phone
    );
    window.open(url, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content track-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="header-icon-circle">
              <Search size={20} />
            </div>
            <div>
              <h3 className="modal-title">Live In-Shop Tool Repair Tracker</h3>
              <p className="modal-subtitle">Search by 10-digit mobile number, customer name, or ticket code (e.g. REP-1001)</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Smart Ticket or Phone Input Form */}
          <form onSubmit={handleSearch} className="track-search-form">
            <div className="track-input-group">
              <input
                type="text"
                className="form-input track-input"
                placeholder="Enter 10-digit Phone or Ticket (e.g. 98230... or REP-1001)"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary track-submit-btn">
                <Search size={16} />
                <span>Track</span>
              </button>
            </div>

            {/* Quick samples bar */}
            <div className="sample-quick-links">
              <span className="sample-label">Quick samples:</span>
              <button 
                type="button" 
                className="sample-link-chip"
                onClick={() => selectSample('REP-1001')}
              >
                REP-1001 (In Progress)
              </button>
              <button 
                type="button" 
                className="sample-link-chip"
                onClick={() => selectSample('REP-1002')}
              >
                REP-1002 (Ready for Pickup)
              </button>
            </div>
          </form>

          {/* Job Details Card */}
          {activeJob ? (
            <div className="track-result-container">
              {/* Job summary header */}
              <div className="job-summary-card">
                <div className="job-summary-top">
                  <div>
                    <span className="job-ref-tag">{activeJob.referenceId}</span>
                    <h4 className="job-tool-title">{activeJob.toolType} • {activeJob.brandModel}</h4>
                  </div>
                  <div className={`status-badge-live status-${activeJob.status}`}>
                    {activeJob.status === 'ready_for_collection' ? 'Ready for Pickup' : activeJob.statusLabel}
                  </div>
                </div>

                <div className="job-meta-grid">
                  <div className="job-meta-item">
                    <span className="meta-label">Customer Name</span>
                    <span className="meta-val">{activeJob.customerName}</span>
                  </div>
                  <div className="job-meta-item">
                    <span className="meta-label">Mobile Number</span>
                    <span className="meta-val">{activeJob.phone}</span>
                  </div>
                  <div className="job-meta-item">
                    <span className="meta-label">Assigned Technician</span>
                    <span className="meta-val">{activeJob.technicianName || 'Diagnostic Workbench'}</span>
                  </div>
                  <div className="job-meta-item">
                    <span className="meta-label">Counter Estimate</span>
                    <span className="meta-val text-primary font-bold">
                      {activeJob.estimatedCost ? `₹${activeJob.estimatedCost.toLocaleString('en-IN')}` : 'Pending Quote'}
                    </span>
                  </div>
                </div>

                <div className="job-issue-box">
                  <span className="meta-label">Customer Reported Issue:</span>
                  <p className="issue-text">{activeJob.issueDescription}</p>
                </div>

                {activeJob.imageUrl && (
                  <div className="job-attached-photo-box">
                    <span className="meta-label">Attached Inspection Photo:</span>
                    <div className="attached-photo-container">
                      <img src={activeJob.imageUrl} alt="Attached tool" className="job-photo-thumb" />
                      <span className="photo-caption">Saved to Firebase Cloud Storage</span>
                    </div>
                  </div>
                )}

                {/* Practical Village Counter Action Buttons */}
                <div className="counter-practical-actions">
                  <button 
                    type="button" 
                    className="action-pill-btn print-btn"
                    onClick={handlePrintSlip}
                    title="Print authentic paper job slip for customer"
                  >
                    <Printer size={15} />
                    <span>🖨️ Job Slip</span>
                  </button>

                  <button 
                    type="button" 
                    className="action-pill-btn print-btn"
                    style={{ background: '#0f172a', color: '#ffffff' }}
                    onClick={() => {
                      if (onOpenInvoice && activeJob) {
                        const cost = activeJob.estimatedCost || 750;
                        onOpenInvoice({
                          invoiceNumber: `INV-${activeJob.referenceId.replace('REP-', 'R')}`,
                          ticketId: activeJob.referenceId,
                          date: new Date().toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }),
                          customerName: activeJob.customerName,
                          customerPhone: activeJob.phone,
                          items: [
                            {
                              description: `Repair Diagnostic & Bench Overhaul: ${activeJob.toolType} (${activeJob.brandModel})`,
                              brand: 'Workshop Service',
                              quantity: 1,
                              unitPrice: Math.round(cost * 0.45),
                              total: Math.round(cost * 0.45)
                            },
                            {
                              description: `Motor Rewinding / Spares Replacement: ${activeJob.issueDescription.slice(0, 40)}`,
                              brand: 'Genuine Spares',
                              quantity: 1,
                              unitPrice: cost - Math.round(cost * 0.45),
                              total: cost - Math.round(cost * 0.45)
                            }
                          ],
                          subtotal: cost,
                          totalAmount: cost,
                          paymentMethod: 'UPI / Cash Counter',
                          paymentStatus: activeJob.status === 'completed' ? 'PAID' : 'DUE',
                          billType: 'repair',
                          technicianName: activeJob.technicianName || 'Certified Technician'
                        });
                      }
                    }}
                    title="View official repair invoice & warranty bill"
                  >
                    <FileText size={15} />
                    <span>📄 View Bill</span>
                  </button>

                  <button 
                    type="button" 
                    className="action-pill-btn whatsapp-btn"
                    onClick={handleOpenWhatsApp}
                    title="Send ticket details to customer on WhatsApp"
                  >
                    <Share2 size={15} />
                    <span>WhatsApp</span>
                  </button>

                  {activeJob.status === 'ready_for_collection' && (
                    <button 
                      type="button" 
                      className="action-pill-btn upi-btn"
                      onClick={() => setIsUpiModalOpen(true)}
                      title="Show counter UPI QR code to customer"
                    >
                      <QrCode size={15} />
                      <span>Show Counter UPI QR</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="timeline-section">
                <h4 className="timeline-title">Service Status Timeline</h4>
                <div className="timeline-list">
                  {activeJob.timeline.map((event, idx) => (
                    <div 
                      key={idx} 
                      className={`timeline-item ${event.completed ? 'completed' : 'pending'}`}
                    >
                      <div className="timeline-marker">
                        {event.completed ? (
                          <CheckCircle2 size={16} className="marker-icon completed" />
                        ) : (
                          <div className="marker-dot" />
                        )}
                        {idx < activeJob.timeline.length - 1 && <div className="timeline-line" />}
                      </div>
                      <div className="timeline-content">
                        <div className="timeline-header-row">
                          <span className="timeline-step-name">{event.label}</span>
                          <span className="timeline-time">{event.timestamp}</span>
                        </div>
                        {event.notes && (
                          <p className="timeline-notes">{event.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-Shop Collection Reminder */}
              <div className="in-shop-alert">
                <MapPin size={18} className="alert-pin" />
                <div>
                  <strong>Shop Counter Collection &amp; Live Load Testing</strong>
                  <p>
                    When status marks <em>Ready for Pickup</em>, visit our 
                    counter at <strong>Station Road Service Center</strong>. Test run the tool 
                    under load with our technician before paying by Cash or UPI.
                  </p>
                </div>
              </div>
            </div>
          ) : searched ? (
            <div className="track-not-found">
              <AlertCircle size={40} className="text-warning" />
              <h4>Ticket / Phone Number Not Found</h4>
              <p>We couldn't locate any repair record for &ldquo;{ticketInput}&rdquo;. Please verify your 10-digit mobile number or try sample tickets REP-1001 or REP-1002.</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Counter UPI QR Modal */}
      {activeJob && (
        <CounterUpiModal
          isOpen={isUpiModalOpen}
          onClose={() => setIsUpiModalOpen(false)}
          amount={activeJob.estimatedCost || 750}
          orderOrTicketRef={activeJob.referenceId}
          customerName={activeJob.customerName}
          onPaymentConfirmed={() => {
            alert(`Payment received for ${activeJob.referenceId}! Hand over machine.`);
          }}
        />
      )}
    </div>
  );
};
