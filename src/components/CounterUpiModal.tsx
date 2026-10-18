import React, { useState } from 'react';
import { X, QrCode, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';
import { SHOP_INFO } from '../data/mockData';

interface CounterUpiModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  orderOrTicketRef: string;
  customerName?: string;
  onPaymentConfirmed?: () => void;
}

export const CounterUpiModal: React.FC<CounterUpiModalProps> = ({
  isOpen,
  onClose,
  amount,
  orderOrTicketRef,
  customerName,
  onPaymentConfirmed
}) => {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const upiId = 'himani.saitoolcare@okaxis';
  const payeeName = 'OM SAI POWER TOOLS';
  
  // Standard UPI URI format
  const upiUri = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderOrTicketRef)}`;
  
  // High quality QR code via standard QR generation API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(upiUri)}&color=131921&bgcolor=ffffff`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onPaymentConfirmed?.();
      onClose();
      setConfirmed(false);
    }, 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content upi-counter-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="header-icon-circle upi-circle">
              <QrCode size={22} className="text-amber-600" />
            </div>
            <div>
              <h3 className="modal-title">Shop Counter UPI Payment (Scan &amp; Pay)</h3>
              <p className="modal-subtitle">Scan at our Station Road desk with PhonePe, Google Pay, or Paytm</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body text-center">
          {/* Amount Badge */}
          <div className="upi-amount-pill">
            <span className="upi-amt-label">Total Amount:</span>
            <span className="upi-amt-value">₹{amount.toLocaleString('en-IN')}</span>
          </div>

          {/* Reference pill */}
          <div className="upi-ref-tag">
            Reference: <strong>{orderOrTicketRef}</strong> {customerName ? `• Customer: ${customerName}` : ''}
          </div>

          {/* QR Code Frame */}
          <div className="upi-qr-frame">
            <img 
              src={qrCodeUrl} 
              alt="Counter UPI QR Code" 
              className="upi-qr-image" 
              width={220}
              height={220}
            />
            <div className="upi-scan-hint">
              <span>Scan with any UPI App</span>
            </div>
          </div>

          {/* UPI ID Row */}
          <div className="upi-id-copy-row">
            <span className="upi-id-text">Shop UPI ID: <strong>{upiId}</strong></span>
            <button 
              type="button" 
              className="upi-copy-btn"
              onClick={handleCopyUpi}
              title="Copy UPI ID"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* App logos row */}
          <div className="upi-apps-row">
            <span className="app-badge">GPay</span>
            <span className="app-badge">PhonePe</span>
            <span className="app-badge">Paytm</span>
            <span className="app-badge">BHIM UPI</span>
          </div>

          {/* Counter physical notice */}
          <div className="upi-offline-notice">
            <ShieldCheck size={16} className="text-emerald-700" />
            <span>₹0 Online Payment Gateway Fee • Direct Counter Settle • Printed Receipt Provided</span>
          </div>

          {/* Confirmation button for Staff/Customer */}
          <div className="upi-actions-row">
            <button 
              type="button" 
              className={`btn btn-primary w-full ${confirmed ? 'confirmed' : ''}`}
              onClick={handleConfirm}
            >
              {confirmed ? (
                <>
                  <CheckCircle2 size={18} />
                  <span>Payment Confirmed!</span>
                </>
              ) : (
                <span>Mark Payment Received at Counter</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
