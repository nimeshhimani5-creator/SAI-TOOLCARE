import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingCart, 
  ShieldCheck, 
  User, 
  Phone,
  Share2,
  QrCode,
  FileText
} from 'lucide-react';
import { CartItem, UserProfile, InvoiceData } from '../types';
import { SHOP_INFO } from '../data/mockData';
import { whatsappService } from '../utils/whatsapp';
import { CounterUpiModal } from './CounterUpiModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: UserProfile | null;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onConfirmReservation: (orderRef: string, customerName: string, phone: string) => Promise<void>;
  onOpenInvoice?: (invoice: InvoiceData) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onConfirmReservation,
  onOpenInvoice
}) => {
  const [reservationPlaced, setReservationPlaced] = useState(false);
  const [orderRef, setOrderRef] = useState('');
  const [customerName, setCustomerName] = useState(currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpiOpen, setIsUpiOpen] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 
    0
  );

  const handlePlaceReservation = async () => {
    const name = customerName || (currentUser ? currentUser.displayName : 'Counter Customer');
    const phone = customerPhone || '9823000000';
    
    setIsSubmitting(true);
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const ref = `ORD-${randomNum}`;
    setOrderRef(ref);

    try {
      await onConfirmReservation(ref, name, phone);
      setReservationPlaced(true);
    } catch (e) {
      console.error('Reservation error:', e);
      setReservationPlaced(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDone = () => {
    setReservationPlaced(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div 
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title-group">
            <ShoppingCart size={20} className="drawer-icon" />
            <h3 className="drawer-title">Shop Collection Cart</h3>
            <span className="drawer-count-badge">{cartItems.length} items</span>
          </div>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {reservationPlaced ? (
            <div className="reservation-confirmed-view">
              <div className="confirmed-icon-circle">
                <CheckCircle2 size={44} className="text-success" />
              </div>
              <h3 className="confirmed-title">Reservation Confirmed!</h3>
              <p className="confirmed-subtitle">
                Your tools and spare parts are held at our counter for 48 hours. Inventory stock has been synced in real-time.
              </p>

              <div className="order-code-card">
                <span className="code-label">Pickup Order Reference</span>
                <span className="code-value">{orderRef}</span>
                <span className="code-hint">Present this code at Om Sai Power Tools counter</span>
              </div>

              <div className="pickup-reminder-box">
                <MapPin size={18} className="pickup-icon" />
                <div>
                  <strong>Collection Address:</strong>
                  <p>{SHOP_INFO.address}, {SHOP_INFO.city}</p>
                  <p className="hours-text"><strong>Hours:</strong> {SHOP_INFO.workingHours}</p>
                </div>
              </div>

              <div className="confirmed-payment-note">
                <ShieldCheck size={16} />
                <span>You can inspect and load-test all items before paying by Cash, UPI, or Card at the shop.</span>
              </div>

              <div className="confirmed-action-buttons">
                <button
                  type="button"
                  className="whatsapp-receipt-btn w-full"
                  onClick={() => {
                    const url = whatsappService.getOrderReservationSlipUrl(
                      orderRef,
                      customerName || 'Customer',
                      cartItems.reduce((acc, i) => acc + i.quantity, 0),
                      totalAmount,
                      customerPhone || '+91 80774 66755'
                    );
                    window.open(url, '_blank');
                  }}
                >
                  <Share2 size={16} />
                  <span>Get WhatsApp Reservation Receipt</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline-dark w-full mt-2"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontWeight: 700 }}
                  onClick={() => {
                    if (onOpenInvoice) {
                      onOpenInvoice({
                        invoiceNumber: `INV-${orderRef.replace('ORD-', '')}`,
                        orderRef: orderRef,
                        date: new Date().toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }),
                        customerName: customerName || 'Valued Customer',
                        customerPhone: customerPhone || '+91 80774 66755',
                        items: cartItems.map((i) => ({
                          description: i.product.name,
                          brand: i.product.brand,
                          quantity: i.quantity,
                          unitPrice: i.product.price,
                          total: i.product.price * i.quantity
                        })),
                        subtotal: totalAmount,
                        totalAmount: totalAmount,
                        paymentMethod: 'UPI / Cash on Counter',
                        paymentStatus: 'RESERVED',
                        billType: 'retail'
                      });
                    }
                  }}
                >
                  <FileText size={16} />
                  <span>📄 View &amp; Print Official Bill</span>
                </button>

                <button
                  type="button"
                  className="btn btn-outline-dark w-full mt-2"
                  onClick={() => setIsUpiOpen(true)}
                >
                  <QrCode size={16} />
                  <span>View Counter UPI QR Code (₹{totalAmount.toLocaleString('en-IN')})</span>
                </button>

                <button className="btn btn-primary w-full mt-2" onClick={handleDone}>
                  <span>Done & Return to Catalog</span>
                </button>
              </div>
            </div>
          ) : cartItems.length > 0 ? (
            <div className="cart-content-wrapper">
              {/* In-Shop Pickup Banner */}
              <div className="drawer-pickup-banner">
                <MapPin size={16} className="banner-pin-icon" />
                <div>
                  <strong>In-Shop Collection Notice:</strong>
                  <p>Items will be packed and ready for pickup at our Station Road center. No delivery fees.</p>
                </div>
              </div>

              {/* Items List */}
              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="cart-item-card">
                    <div className="cart-item-left">
                      <span className="cart-item-brand">{item.product.brand}</span>
                      <h4 className="cart-item-name">{item.product.name}</h4>
                      <div className="cart-item-price">
                        ₹{item.product.price.toLocaleString('en-IN')} each
                      </div>
                    </div>

                    <div className="cart-item-right">
                      <div className="quantity-stepper">
                        <button
                          className="step-btn"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="step-val">{item.quantity}</span>
                        <button
                          className="step-btn"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stockCount}
                        >
                          +
                        </button>
                      </div>

                      <div className="item-subtotal">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>

                      <button
                        className="remove-item-btn"
                        onClick={() => onRemoveItem(item.product.id)}
                        title="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Customer Contact Inputs */}
              <div className="cart-contact-fields">
                <div className="form-group">
                  <label className="form-label">Pickup Customer Name:</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Your Name (e.g. Ramesh)"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="form-group mt-2">
                  <label className="form-label">WhatsApp / Contact Phone:</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Phone (e.g. 98230 12345)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              {/* Cart Summary and Action */}
              <div className="drawer-footer-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="summary-row">
                  <span>Collection & Handling Fee</span>
                  <span className="text-success font-bold">FREE (Shop Pickup)</span>
                </div>
                <div className="summary-divider" />
                <div className="summary-total-row">
                  <span>Total Payable at Counter</span>
                  <span className="total-figure">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>

                <button 
                  className="btn btn-primary w-full mt-3 reserve-order-btn"
                  onClick={handlePlaceReservation}
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Syncing with Firestore...' : 'Confirm Counter Reservation'}</span>
                  <ArrowRight size={16} />
                </button>
                <p className="pay-at-shop-hint">
                  ✓ Zero online payment required. Inspect your tools & pay directly at the shop counter.
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-cart-state">
              <ShoppingCart size={48} className="empty-cart-icon" />
              <h4>Your Collection Cart is Empty</h4>
              <p>Explore our catalog of professional tools, armatures, and spare parts to reserve items for shop pickup.</p>
              <button className="btn btn-primary mt-3" onClick={onClose}>
                Browse Tools Catalog
              </button>
            </div>
          )}
        </div>
      </div>

      <CounterUpiModal
        isOpen={isUpiOpen}
        onClose={() => setIsUpiOpen(false)}
        amount={totalAmount}
        orderOrTicketRef={orderRef}
        customerName={customerName}
        onPaymentConfirmed={() => {
          setIsUpiOpen(false);
          handleDone();
        }}
      />
    </div>
  );
};
