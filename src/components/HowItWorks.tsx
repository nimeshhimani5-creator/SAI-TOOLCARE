import React from 'react';
import { ShoppingBag, BellRing, ShieldCheck, MapPin } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works-section" className="how-it-works-section">
      <div className="container">
        <div className="section-header-compact text-center">
          <h2 className="section-title">How Counter Collection Works</h2>
        </div>

        <div className="workflow-grid-3">
          <div className="workflow-card">
            <div className="workflow-badge-num">Step 1</div>
            <div className="workflow-icon-box">
              <ShoppingBag size={28} className="text-primary" />
            </div>
            <h3 className="workflow-card-title">Reserve Online</h3>
            <p className="workflow-card-desc">
              Select tools or genuine copper spares with ₹0 online advance.
            </p>
          </div>

          <div className="workflow-card">
            <div className="workflow-badge-num">Step 2</div>
            <div className="workflow-icon-box">
              <BellRing size={28} className="text-primary" />
            </div>
            <h3 className="workflow-card-title">Tagged for 48 Hours</h3>
            <p className="workflow-card-desc">
              Stock is reserved at our counter under your name and phone number.
            </p>
          </div>

          <div className="workflow-card">
            <div className="workflow-badge-num">Step 3</div>
            <div className="workflow-icon-box">
              <ShieldCheck size={28} className="text-primary" />
            </div>
            <h3 className="workflow-card-title">Inspect, Test &amp; Pay</h3>
            <p className="workflow-card-desc">
              Visit Station Road counter, test on load, and pay via Cash or UPI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
