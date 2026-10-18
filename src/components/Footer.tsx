import React from 'react';
import { 
  PhoneCall, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Wrench, 
  CheckCircle, 
  ArrowUp,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { SHOP_INFO } from '../data/mockData';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="amazon-footer-root">
      {/* 1. Amazon 'Back to top' Full-Width Bar */}
      <button 
        className="amazon-back-to-top-btn" 
        onClick={scrollToTop}
        aria-label="Back to top of page"
      >
        <ArrowUp size={16} />
        <span>Back to top</span>
      </button>

      {/* 2. Main 4-Column Directory (Amazon Navy #232f3e) */}
      <div className="amazon-footer-main">
        <div className="container amazon-footer-grid">
          {/* Column 1: Get to Know Us */}
          <div className="footer-col">
            <h4 className="footer-col-title">Get to Know Us</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#shop-info-section">About Om Sai Power Tools</a>
              </li>
              <li>
                <span className="owner-cred">Founder & Owner: <strong>Himani</strong></span>
              </li>
              <li>
                <a href="#catalog-section">100% Pure Copper Guarantee</a>
              </li>
              <li>
                <a href="#how-it-works-section">In-Store Counter Testing Slab</a>
              </li>
              <li>
                <span className="footer-pill-note">Station Road Center Since 2012</span>
              </li>
            </ul>
          </div>

          {/* Column 2: In-Shop Repair Services */}
          <div className="footer-col">
            <h4 className="footer-col-title">Repair & Service Desk</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#repairs-section">In-Shop Diagnostic Testing</a>
              </li>
              <li>
                <a href="#repairs-section">Armature & Commutator Replacement</a>
              </li>
              <li>
                <a href="#repairs-section">Demolition Hammer Piston Overhaul</a>
              </li>
              <li>
                <a href="#repairs-section">Carbon Brush Spark Arrestor Kits</a>
              </li>
              <li>
                <a href="#repairs-section">Live 7-Stage Repair Tracker</a>
              </li>
            </ul>
          </div>

          {/* Column 3: Store Counter Policies */}
          <div className="footer-col">
            <h4 className="footer-col-title">Shop Collection & Policies</h4>
            <ul className="footer-links-list">
              <li>
                <a href="#how-it-works-section">Counter Pickup Only (No Delivery)</a>
              </li>
              <li>
                <span className="footer-highlight-text">₹0 Online Payment (Pay at counter)</span>
              </li>
              <li>
                <span>48-Hour Counter Reservation Window</span>
              </li>
              <li>
                <span>Payment: Cash & Shop UPI QR Accepted</span>
              </li>
              <li>
                <span>Full Load RPM Inspection Before Handover</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Workshop Timings */}
          <div className="footer-col">
            <h4 className="footer-col-title">Workshop Location & Hours</h4>
            <div className="footer-contact-block">
              <div className="contact-item">
                <MapPin size={15} className="contact-icon text-amber-400" />
                <span>Station Road, Near Railway Crossing, Pimpri-Chinchwad, Pune 411033</span>
              </div>
              <div className="contact-item">
                <Clock size={15} className="contact-icon text-amber-400" />
                <span>Mon – Sat: 9:00 AM – 8:30 PM (Sunday Closed)</span>
              </div>
              <div className="contact-item">
                <PhoneCall size={15} className="contact-icon text-amber-400" />
                <a href={`tel:${SHOP_INFO.phone}`} className="phone-link">{SHOP_INFO.phone}</a>
              </div>
              <div className="contact-item">
                <MessageCircle size={15} className="contact-icon text-emerald-400" />
                <a 
                  href="https://wa.me/918077466755?text=Namaste%20Himani%20Ji%2C%20I%20have%20an%20inquiry%20regarding%20power%20tool%20repair%20and%20spare%20parts."
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-btn-mini"
                >
                  WhatsApp Workshop Team ➔
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Amazon Dark Navy Strip (#131921) */}
      <div className="amazon-footer-bottom">
        <div className="container bottom-inner">
          <div className="bottom-brand-row">
            <BrandLogo size={36} lightText={true} />
            <div className="bottom-trust-badges">
              <span className="trust-pill">
                <CheckCircle size={12} className="text-emerald-400" />
                100% Genuine Copper
              </span>
              <span className="trust-pill">
                <ShieldCheck size={12} className="text-amber-400" />
                Zero Online Transaction Fees
              </span>
              <span className="trust-pill">
                <Wrench size={12} className="text-amber-400" />
                Tested Before Payment
              </span>
            </div>
          </div>

          <div className="bottom-copyright-text">
            <p>
              &copy; {new Date().getFullYear()} <strong>Om Sai Power Tools & Repairing Center (Sai ToolCare)</strong> &bull; Founded and Managed by <strong>Himani</strong>.
            </p>
            <p className="bottom-disclaimer">
              Station Road, Pimpri-Chinchwad &bull; In-Shop Counter Collection & Testing Only &bull; Settle via Cash or Shop UPI QR upon inspection.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
