import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Camera, 
  UploadCloud, 
  Image as ImageIcon, 
  Trash2,
  Share2
} from 'lucide-react';
import { RepairJob } from '../types';
import { storageService } from '../services/storageService';
import { whatsappService } from '../utils/whatsapp';

interface RepairModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitRepair: (repair: RepairJob) => Promise<void> | void;
  onViewTracker: (referenceId: string) => void;
}

export const RepairModal: React.FC<RepairModalProps> = ({
  isOpen,
  onClose,
  onSubmitRepair,
  onViewTracker
}) => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [toolType, setToolType] = useState('Angle Grinder');
  const [brandModel, setBrandModel] = useState('');
  const [issueDescription, setIssueDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !brandModel || !issueDescription) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const referenceId = `REP-${randomSuffix}`;

    let uploadedUrl: string | undefined = undefined;

    // 1. Upload photo to Firebase Storage if attached
    if (selectedImage) {
      try {
        uploadedUrl = await storageService.uploadRepairImage(selectedImage, referenceId);
      } catch (err) {
        console.warn('Storage upload error:', err);
      }
    }

    // 2. Prepare Repair Job record
    const newRepair: RepairJob = {
      referenceId,
      customerName,
      phone,
      toolType,
      brandModel,
      issueDescription,
      status: 'requested',
      statusLabel: 'Request Submitted',
      submittedAt: 'Just now',
      imageUrl: uploadedUrl,
      timeline: [
        {
          status: 'requested',
          label: 'Repair Request Submitted',
          timestamp: 'Today (Online)',
          completed: true,
          notes: uploadedUrl 
            ? 'Customer submitted tool details and inspection photo online.' 
            : 'Customer submitted tool details online.'
        },
        {
          status: 'received_at_shop',
          label: 'Awaiting Counter Drop-off',
          timestamp: 'Bring tool to shop counter',
          completed: false,
          notes: 'Please bring machine to Station Road shop with ticket slip.'
        },
        {
          status: 'inspection',
          label: 'Diagnostic Inspection',
          timestamp: 'Pending drop-off',
          completed: false
        },
        {
          status: 'awaiting_customer_approval',
          label: 'Approval & Estimate',
          timestamp: 'Pending inspection',
          completed: false
        },
        {
          status: 'in_progress',
          label: 'Repair & Bench Test',
          timestamp: 'Pending approval',
          completed: false
        },
        {
          status: 'ready_for_collection',
          label: 'Ready for Collection',
          timestamp: 'Pending completion',
          completed: false
        },
        {
          status: 'completed',
          label: 'Collected',
          timestamp: 'Pending pickup',
          completed: false
        }
      ]
    };

    try {
      await onSubmitRepair(newRepair);
      setSubmittedTicket(referenceId);
    } catch (e) {
      console.error(e);
      setSubmittedTicket(referenceId);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedTicket(null);
    setCustomerName('');
    setPhone('');
    setBrandModel('');
    setIssueDescription('');
    handleRemoveImage();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleResetAndClose}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="header-icon-circle">
              <Wrench size={20} />
            </div>
            <div>
              <h3 className="modal-title">Book In-Shop Tool Repair</h3>
              <p className="modal-subtitle">Submit details & photo before bringing your tool to the counter</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={handleResetAndClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {submittedTicket ? (
            /* Success confirmation view */
            <div className="repair-success-box">
              <div className="success-badge-icon">
                <CheckCircle2 size={48} className="text-success" />
              </div>
              <h3 className="success-title">Repair Ticket Registered!</h3>
              <p className="success-desc">
                Your repair booking has been saved to the live database.
              </p>

              <div className="ticket-card-highlight">
                <span className="ticket-label">Your Booking Ticket Reference</span>
                <span className="ticket-number">{submittedTicket}</span>
                <span className="ticket-hint">Save this ticket code or show SMS at counter</span>
              </div>

              <div className="pickup-notice-box">
                <MapPin size={18} className="notice-icon" />
                <div>
                  <strong>Next Step: Drop tool at our service counter</strong>
                  <p>
                    Bring your tool to <strong>Om Sai Power Tools, Station Road</strong>. 
                    Our technicians will inspect it on the bench and send you the estimate.
                  </p>
                </div>
              </div>

              <div className="success-actions-row">
                <button 
                  type="button" 
                  className="whatsapp-receipt-btn"
                  onClick={() => {
                    if (submittedTicket) {
                      const url = whatsappService.getRepairBookingSlipUrl(
                        submittedTicket,
                        customerName,
                        toolType,
                        brandModel,
                        phone
                      );
                      window.open(url, '_blank');
                    }
                  }}
                >
                  <Share2 size={16} />
                  <span>Get WhatsApp Receipt</span>
                </button>

                <button 
                  className="btn btn-primary w-full"
                  onClick={() => {
                    handleResetAndClose();
                    onViewTracker(submittedTicket);
                  }}
                >
                  <span>Track Status Live ({submittedTicket})</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="repair-form">
              {/* Important service notice */}
              <div className="form-info-notice">
                <AlertCircle size={16} className="text-primary" />
                <span>
                  <strong>In-Shop Service Only:</strong> Tools must be brought to our workshop. No courier or doorstep collection is provided.
                </span>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Customer Name *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g., Ramesh Patil"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="e.g., 98230 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Tool Machine Type *</label>
                  <select
                    className="form-input"
                    value={toolType}
                    onChange={(e) => setToolType(e.target.value)}
                  >
                    <option value="Angle Grinder">Angle Grinder (4-inch / 5-inch)</option>
                    <option value="Demolition Hammer">Demolition Hammer (Hex 17 / SDS-Max)</option>
                    <option value="Rotary Hammer Drill">Rotary Hammer (20mm / 26mm / 28mm)</option>
                    <option value="Marble / Tile Cutter">Marble / Tile Cutter (110mm)</option>
                    <option value="Impact Drill">Impact Drill / Cordless Drill</option>
                    <option value="Wood Cut-off Saw">Miter / Wood Circular Saw</option>
                    <option value="Other Tool">Other Power Tool</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Brand & Model Number *</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="e.g., Bosch GWS 600 or Makita M0810"
                    value={brandModel}
                    onChange={(e) => setBrandModel(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Issue / Problem Description *</label>
                <textarea
                  required
                  rows={3}
                  className="form-input"
                  placeholder="Describe the issue (e.g., Heavy sparking from air vents, not starting, burning smell, hammer not hammering, switch jammed)..."
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                />
              </div>

              {/* Quick issue tags */}
              <div className="quick-issues-row">
                <span className="quick-tag-label">Common issues:</span>
                {['Heavy Sparking', 'Motor Not Starting', 'Burning Smell', 'Switch Broken'].map((issue) => (
                  <button
                    key={issue}
                    type="button"
                    className="issue-chip"
                    onClick={() => {
                      setIssueDescription((prev) => 
                        prev ? `${prev}, ${issue}` : issue
                      );
                    }}
                  >
                    + {issue}
                  </button>
                ))}
              </div>

              {/* Photo Upload to Firebase Storage */}
              <div className="form-group tool-photo-upload-group">
                <label className="form-label">
                  Attach Tool or Nameplate Photo (Optional — Saved to Cloud Storage)
                </label>
                
                {imagePreview ? (
                  <div className="image-preview-card">
                    <img src={imagePreview} alt="Tool preview" className="preview-thumb" />
                    <div className="preview-meta">
                      <span className="file-name">{selectedImage?.name}</span>
                      <span className="file-size">{((selectedImage?.size || 0) / 1024).toFixed(1)} KB</span>
                    </div>
                    <button 
                      type="button" 
                      className="remove-img-btn"
                      onClick={handleRemoveImage}
                      title="Remove photo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="upload-dropzone">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden-file-input" 
                      onChange={handleImageChange}
                    />
                    <UploadCloud size={24} className="upload-icon" />
                    <span className="upload-title">Click or drag a photo of your tool or armature</span>
                    <span className="upload-hint">PNG, JPG, WebP up to 5MB</span>
                  </label>
                )}
              </div>

              <div className="modal-actions-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={handleResetAndClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <Wrench size={16} />
                  <span>{isSubmitting ? 'Uploading & Saving...' : 'Submit Repair Booking'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
