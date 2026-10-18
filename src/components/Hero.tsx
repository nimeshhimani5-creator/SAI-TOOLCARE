import React, { useState } from 'react';
import { 
  Wrench, 
  ShoppingBag, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Activity, 
  Package, 
  Cpu, 
  Disc, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { SHOP_INFO, SAMPLE_REPAIRS } from '../data/mockData';
import { ProductCategory } from '../types';
import { Language, getTranslation } from '../utils/translations';

interface HeroProps {
  onOpenRepairModal: () => void;
  onOpenTrackModal: (ticketId?: string) => void;
  onBrowseCatalog: () => void;
  onSelectCategory?: (cat: ProductCategory) => void;
  language?: Language;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenRepairModal,
  onOpenTrackModal,
  onBrowseCatalog,
  onSelectCategory,
  language = 'en'
}) => {
  const [quickTicketInput, setQuickTicketInput] = useState('');

  const handleQuickTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTicketInput.trim()) {
      onOpenTrackModal(quickTicketInput.trim().toUpperCase());
    } else {
      onOpenTrackModal();
    }
  };

  return (
    <section className="amazon-hero-section">
      {/* 1. Amazon Top Hero Banner Showcase */}
      <div className="amazon-hero-banner">
        <div className="hero-banner-content">
          <div className="hero-announcement-chip">
            <Sparkles size={14} className="text-amber-400" />
            <span>Station Road Counter, Opp. Bus Depot &bull; Contact: +91 80774 66755</span>
          </div>

          <h1 className="amazon-hero-headline">
            OM SAI POWER TOOLS <span className="gold-text">&amp; REPAIRING CENTER</span>
          </h1>

          <p className="amazon-hero-tagline">
            Heavy-Duty Industrial Tools &bull; 100% Genuine Copper Spares &bull; Precision Bench Testing
          </p>

          <div className="hero-banner-badges">
            <span className="hero-mini-pill">
              <CheckCircle2 size={13} className="text-emerald-400" />
              100% Pure Copper Guarantee
            </span>
            <span className="hero-mini-pill">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Prior Diagnostic Quote
            </span>
            <span className="hero-mini-pill">
              <CheckCircle2 size={13} className="text-emerald-400" />
              Counter Load-Test Desk
            </span>
            <span className="hero-mini-pill">
              <CheckCircle2 size={13} className="text-emerald-400" />
              ₹0 Online Advance
            </span>
          </div>
        </div>
      </div>

      {/* 2. Clean 4-Quadrant Visual Grid */}
      <div className="container amazon-quadrant-container">
        <div className="amazon-quadrant-grid">
          {/* Card 1: Tool Repair */}
          <div className="amazon-feature-card">
            <h3 className="feature-card-title">Tool Repair Desk</h3>
            <div className="feature-card-media repair-bg">
              <div className="feature-media-overlay">
                <Wrench size={32} className="text-amber-400" />
                <span className="feature-media-chip">Certified Mechanics</span>
              </div>
            </div>
            <p className="feature-card-desc">
              Precision armature rebuilding, carbon replacement &amp; bench testing.
            </p>
            <button 
              className="feature-card-link-btn"
              onClick={onOpenRepairModal}
            >
              <span>Book Tool Ticket</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 2: 100% Copper Armatures */}
          <div className="amazon-feature-card">
            <h3 className="feature-card-title">100% Pure Copper Spares</h3>
            <div className="feature-card-media spares-bg">
              <div className="feature-media-overlay">
                <Cpu size={32} className="text-amber-400" />
                <span className="feature-media-chip">Dynamically Balanced</span>
              </div>
            </div>
            <p className="feature-card-desc">
              Rotors, bearings &amp; switches for Bosch, Makita &amp; Dongcheng.
            </p>
            <button 
              className="feature-card-link-btn"
              onClick={() => {
                onSelectCategory?.('spare-parts');
                onBrowseCatalog();
              }}
            >
              <span>Explore Spares</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3: Live Service Tracker */}
          <div className="amazon-feature-card track-card">
            <h3 className="feature-card-title">Live Repair Tracker</h3>
            <div className="feature-track-widget">
              <span className="text-xs text-muted">
                Enter ticket ID or 10-digit mobile:
              </span>
              <form onSubmit={handleQuickTrackSubmit} className="mini-track-form">
                <input 
                  type="text" 
                  placeholder="e.g. 8077466755 or REP-1001" 
                  value={quickTicketInput}
                  onChange={(e) => setQuickTicketInput(e.target.value)}
                />
                <button type="submit" className="mini-track-btn" aria-label="Search Ticket">
                  <Search size={15} />
                </button>
              </form>
              <div className="sample-ticket-tags">
                <span className="sample-label">Sample:</span>
                <button 
                  type="button" 
                  className="sample-tag-btn"
                  onClick={() => onOpenTrackModal('REP-1001')}
                >
                  REP-1001
                </button>
                <button 
                  type="button" 
                  className="sample-tag-btn"
                  onClick={() => onOpenTrackModal('REP-1002')}
                >
                  REP-1002
                </button>
              </div>
            </div>
            <button 
              className="feature-card-link-btn"
              onClick={() => onOpenTrackModal()}
            >
              <span>View Full Tracker</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 4: Counter Pickup */}
          <div className="amazon-feature-card">
            <h3 className="feature-card-title">Station Road Counter</h3>
            <div className="feature-card-media pickup-bg">
              <div className="feature-media-overlay">
                <MapPin size={32} className="text-emerald-400" />
                <span className="feature-media-chip">Opp. Bus Depot</span>
              </div>
            </div>
            <p className="feature-card-desc">
              Reserve online with ₹0 advance. Inspect, test on load, and pay at counter.
            </p>
            <button 
              className="feature-card-link-btn"
              onClick={onBrowseCatalog}
            >
              <span>Browse Catalog</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
