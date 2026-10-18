import React from 'react';
import { TESTIMONIALS } from '../data/mockData';
import { Star, Quote, MapPin, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header-compact text-center">
          <span className="badge badge-primary">Trusted by Professionals</span>
          <h2 className="section-title">What Contractors & Carpenters Say</h2>
          <p className="section-subtitle centered">
            From emergency armature replacements to genuine blades, local tradesmen rely on our transparent counter service.
          </p>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="testimonial-header">
                <div className="quote-badge">
                  <Quote size={18} className="quote-icon" />
                </div>
                <div className="stars-row">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={14} className="star-filled" />
                  ))}
                </div>
              </div>

              <p className="testimonial-comment">"{t.comment}"</p>

              <div className="testimonial-footer">
                <div className="author-avatar">
                  {t.name.charAt(0)}
                </div>
                <div className="author-info">
                  <strong className="author-name">{t.name}</strong>
                  <span className="author-role">{t.role}</span>
                  <span className="author-location">
                    <MapPin size={11} /> {t.location}
                  </span>
                </div>
                <div className="verified-badge" title="Verified in-shop customer">
                  <CheckCircle2 size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
