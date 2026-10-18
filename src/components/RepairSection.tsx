import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Activity, 
  Sparkles, 
  Calculator, 
  CheckCheck 
} from 'lucide-react';

interface RepairSectionProps {
  onOpenRepairModal: () => void;
  onOpenTrackModal: (initialId?: string) => void;
}

export const RepairSection: React.FC<RepairSectionProps> = ({
  onOpenRepairModal,
  onOpenTrackModal
}) => {
  // Interactive Instant Estimator State
  const [selectedTool, setSelectedTool] = useState('Angle Grinder');
  const [selectedIssue, setSelectedIssue] = useState('Armature Sparking / Burning');

  // Estimate computation logic
  const getEstimateInfo = () => {
    if (selectedTool === 'Angle Grinder') {
      if (selectedIssue === 'Armature Sparking / Burning') {
        return { range: '₹650 – ₹850', time: '2 – 4 Hours', parts: 'New 100% Copper Armature + Auto-cut Carbon Brushes' };
      }
      if (selectedIssue === 'Broken Switch / Lead Cable') {
        return { range: '₹180 – ₹280', time: '1 – 2 Hours', parts: 'Heavy-Duty Switch + Cable Terminal Reinforcement' };
      }
      return { range: '₹140 – ₹250', time: '30 Mins', parts: 'High-density auto-stop carbon brushes pair' };
    }
    if (selectedTool === 'Demolition Hammer') {
      if (selectedIssue === 'No Impact / Piston Stuck') {
        return { range: '₹950 – ₹1,350', time: 'Same Day', parts: 'OEM Piston Seal Kit + High-temperature Hammer Grease' };
      }
      return { range: '₹1,200 – ₹1,800', time: '24 Hours', parts: 'Genuine Winding Armature / Field Coil Rewind' };
    }
    if (selectedTool === 'Marble / Tile Cutter') {
      return { range: '₹550 – ₹780', time: '3 – 5 Hours', parts: 'Armature Replacement + Flange Lock Nut' };
    }
    return { range: '₹350 – ₹600', time: '2 – 3 Hours', parts: 'Chuck Assembly / Switch Replacement' };
  };

  const estimate = getEstimateInfo();

  return (
    <section id="repairs-section" className="repairs-section">
      <div className="container">
        {/* Section Header */}
        <div className="repair-header-block">
          <div className="header-badge-row center-badge">
            <span className="badge badge-primary">
              <Sparkles size={12} />
              Certified Workshop Desk
            </span>
          </div>
          <h2 className="section-title">In-Shop Tool Repair Desk</h2>
          <p className="repair-subtitle">
            Precision bench diagnostics, 100% genuine copper rewinding, and live load testing before payment.
          </p>
        </div>

        {/* 4-Step Repair Workflow */}
        <div className="repair-steps-grid">
          <div className="repair-step-card">
            <div className="step-circle">01</div>
            <h4 className="step-card-title">Drop Off at Counter</h4>
            <p className="step-card-desc">
              Station Road, Opp. Bus Depot. Receive your official job slip.
            </p>
          </div>

          <div className="repair-step-card">
            <div className="step-circle">02</div>
            <h4 className="step-card-title">Bench Diagnostics</h4>
            <p className="step-card-desc">
              Armature resistance, commutator runout &amp; gear inspection.
            </p>
          </div>

          <div className="repair-step-card">
            <div className="step-circle">03</div>
            <h4 className="step-card-title">Clear Quote First</h4>
            <p className="step-card-desc">
              Transparent quotation approved before turning a single screw.
            </p>
          </div>

          <div className="repair-step-card">
            <div className="step-circle">04</div>
            <h4 className="step-card-title">Load Test &amp; Collect</h4>
            <p className="step-card-desc">
              Test run at full RPM with our mechanic before payment.
            </p>
          </div>
        </div>

        {/* Interactive Instant Cost Estimator Widget */}
        <div className="repair-estimator-card">
          <div className="estimator-header">
            <div className="estimator-title-group">
              <div className="estimator-icon-box">
                <Calculator size={22} />
              </div>
              <div>
                <h3 className="estimator-title">Quick In-Shop Repair Cost Estimator</h3>
                <p className="estimator-subtitle">Select your tool and problem to see transparent ballpark repair pricing</p>
              </div>
            </div>
          </div>

          <div className="estimator-body-grid">
            {/* Left Selectors */}
            <div className="estimator-inputs">
              <div className="form-group">
                <label className="form-label">Select Power Tool:</label>
                <div className="tool-selector-chips">
                  {['Angle Grinder', 'Demolition Hammer', 'Marble / Tile Cutter', 'Impact Drill'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      className={`tool-chip ${selectedTool === t ? 'active' : ''}`}
                      onClick={() => setSelectedTool(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group mt-3">
                <label className="form-label">Observed Tool Fault:</label>
                <div className="tool-selector-chips">
                  {(selectedTool === 'Demolition Hammer'
                    ? ['No Impact / Piston Stuck', 'Motor Burning / Smoking']
                    : ['Armature Sparking / Burning', 'Broken Switch / Lead Cable', 'Carbon Brush Worn Out']
                  ).map((issue) => (
                    <button
                      key={issue}
                      type="button"
                      className={`tool-chip ${selectedIssue === issue ? 'active' : ''}`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      {issue}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Result Card */}
            <div className="estimator-result-card">
              <span className="result-tag">Estimated Workshop Cost</span>
              <div className="result-price-highlight">
                <span className="est-range">{estimate.range}</span>
                <span className="est-tax">approx. parts & labour</span>
              </div>

              <div className="est-specs-list">
                <div className="est-row">
                  <Clock size={15} className="est-icon" />
                  <span>Turnaround Time: <strong>{estimate.time}</strong></span>
                </div>
                <div className="est-row">
                  <CheckCheck size={15} className="est-icon" />
                  <span>Key Parts: <strong>{estimate.parts}</strong></span>
                </div>
                <div className="est-row">
                  <ShieldCheck size={15} className="est-icon" />
                  <span>Testing: <strong>Live RPM & Load Test Included</strong></span>
                </div>
              </div>

              <button className="btn btn-primary w-full mt-3" onClick={onOpenRepairModal}>
                <Wrench size={16} />
                <span>Book This Repair ({selectedTool})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Tracking Chips Banner */}
        <div className="repair-cta-banner">
          <div className="cta-left">
            <h3 className="cta-title">Already dropped off your tool at our shop?</h3>
            <p className="cta-desc">
              Enter your ticket reference or explore sample live tickets to see our diagnosis timeline in action.
            </p>
            <div className="cta-buttons-row">
              <button className="btn btn-primary" onClick={onOpenRepairModal}>
                <Wrench size={18} />
                <span>Book New Diagnostic Slot</span>
              </button>
              <button className="btn btn-outline-white" onClick={() => onOpenTrackModal()}>
                <Search size={18} />
                <span>Search by Ticket Number</span>
              </button>
            </div>
          </div>

          <div className="cta-right-samples">
            <span className="samples-heading">Test Live Tracking (Pre-Loaded Tickets):</span>
            <div className="sample-tickets-list">
              <div 
                className="sample-ticket-chip"
                onClick={() => onOpenTrackModal('REP-1001')}
                title="Click to track REP-1001"
              >
                <div className="ticket-badge">REP-1001</div>
                <div className="ticket-info">
                  <strong>Bosch Grinder (Armature replacement)</strong>
                  <span className="status-in-progress">• Bench Test in Progress</span>
                </div>
                <ArrowRight size={14} className="ticket-arrow" />
              </div>

              <div 
                className="sample-ticket-chip"
                onClick={() => onOpenTrackModal('REP-1002')}
                title="Click to track REP-1002"
              >
                <div className="ticket-badge">REP-1002</div>
                <div className="ticket-info">
                  <strong>Makita Demolition Hammer (Piston seal kit)</strong>
                  <span className="status-ready">• Ready for Counter Pickup</span>
                </div>
                <ArrowRight size={14} className="ticket-arrow" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
