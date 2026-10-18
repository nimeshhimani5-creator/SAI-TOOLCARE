import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="container">
        <div className="section-header-compact text-center">
          <span className="badge badge-primary">Clear & Transparent</span>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle centered">
            Everything you need to know about our shop pickup policy, diagnostic testing, and spare parts guarantee.
          </p>
        </div>

        <div className="faq-accordion-wrapper">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`faq-card ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question-row">
                  <div className="faq-q-left">
                    <HelpCircle size={18} className="faq-q-icon" />
                    <h3 className="faq-question-text">{faq.question}</h3>
                  </div>
                  <button className="faq-toggle-btn" aria-label="Toggle answer">
                    <ChevronDown size={18} className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
                  </button>
                </div>

                {isOpen && (
                  <div className="faq-answer-row">
                    <p className="faq-answer-text">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
