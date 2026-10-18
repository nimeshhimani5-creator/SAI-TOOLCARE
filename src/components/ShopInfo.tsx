import React from 'react';
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Navigation 
} from 'lucide-react';
import { SHOP_INFO } from '../data/mockData';

export const ShopInfo: React.FC = () => {
  return (
    <section id="shop-info-section" className="shop-info-section">
      <div className="container">
        <div className="shop-info-card-modern">
          <div className="shop-info-left">
            <div className="header-badge-row">
              <span className="badge badge-primary">
                <Sparkles size={12} />
                Physical Workshop & Counter Desk
              </span>
            </div>
            
            <h2 className="shop-title">{SHOP_INFO.name}</h2>
            <p className="shop-subtitle">{SHOP_INFO.tagline}</p>

            <div className="info-detail-list">
              <div className="info-detail-item">
                <div className="info-icon-wrapper">
                  <MapPin size={22} className="info-icon" />
                </div>
                <div>
                  <strong className="detail-heading">Physical Store & Workshop Address</strong>
                  <p className="detail-text">{SHOP_INFO.address}</p>
                  <p className="city-text">{SHOP_INFO.city}</p>
                  <span className="landmark-tag">📍 Landmark: Opposite Main MSRTC Bus Depot & Railway Station Exit</span>
                </div>
              </div>

              <div className="info-detail-item">
                <div className="info-icon-wrapper">
                  <Clock size={22} className="info-icon" />
                </div>
                <div>
                  <strong className="detail-heading">Workshop Counter Operating Hours</strong>
                  <p className="detail-text">{SHOP_INFO.workingHours}</p>
                  <span className="timing-note">⚡ Fast-turnaround emergency servicing available during work hours</span>
                </div>
              </div>

              <div className="info-detail-item">
                <div className="info-icon-wrapper">
                  <Phone size={22} className="info-icon" />
                </div>
                <div>
                  <strong className="detail-heading">Customer Desk & Technical Advice</strong>
                  <p className="detail-text">{SHOP_INFO.phone} (Voice Calls & Enquiries)</p>
                  <p className="detail-text">{SHOP_INFO.whatsapp} (WhatsApp Parts Photos & Status)</p>
                </div>
              </div>
            </div>

            <div className="shop-buttons-row">
              <a 
                href={`tel:${SHOP_INFO.phone}`} 
                className="btn btn-dark"
              >
                <Phone size={16} />
                <span>Call Store Desk</span>
              </a>
              <a 
                href={`https://wa.me/918077466755?text=Hello%20Om%20Sai%20Power%20Tools%2C%20I%20have%20an%20enquiry%20regarding%20power%20tool%20parts%2Frepair.`} 
                target="_blank" 
                rel="noreferrer" 
                className="btn btn-primary"
              >
                <MessageSquare size={16} />
                <span>WhatsApp Workshop</span>
              </a>
            </div>
          </div>

          <div className="shop-info-right">
            <div className="counter-notice-box-modern">
              <div className="counter-notice-header">
                <ShieldCheck size={22} className="text-primary" />
                <div>
                  <h4>In-Shop Service & Testing Guarantee</h4>
                  <span className="notice-sub">Policy Approved by Shop Management</span>
                </div>
              </div>
              
              <p className="counter-notice-body">
                {SHOP_INFO.collectionNotice}
              </p>

              <div className="counter-features-list">
                <div className="feature-row">
                  <CheckCircle2 size={16} className="feature-check" />
                  <span><strong>Live Test Bench:</strong> Test machines under full current load before payment.</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={16} className="feature-check" />
                  <span><strong>Fitment Verification:</strong> Bring your old armature or brush to match exact dimensions.</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={16} className="feature-check" />
                  <span><strong>48-Hour Order Hold:</strong> Reserved online items are tagged and saved for 2 days.</span>
                </div>
                <div className="feature-row">
                  <CheckCircle2 size={16} className="feature-check" />
                  <span><strong>Zero Delivery Markup:</strong> Pure direct factory-counter pricing with no hidden delivery fees.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
