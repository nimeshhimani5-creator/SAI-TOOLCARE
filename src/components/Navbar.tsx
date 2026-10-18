import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Menu, 
  X, 
  MapPin, 
  Wrench, 
  User as UserIcon, 
  ChevronDown,
  Clock,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  CheckCircle,
  Package,
  Globe,
  FileText
} from 'lucide-react';
import { SHOP_INFO } from '../data/mockData';
import { ProductCategory, UserProfile } from '../types';
import { BrandLogo } from './BrandLogo';
import { Language, getTranslation } from '../utils/translations';

interface NavbarProps {
  cartCount: number;
  currentUser: UserProfile | null;
  pendingOrdersCount?: number;
  activeRepairsCount?: number;
  selectedCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenCart: () => void;
  onOpenRepairModal: () => void;
  onOpenTrackModal: () => void;
  onOpenAuthModal: () => void;
  onOpenAdminPortal?: () => void;
  onOpenTechnicianPortal?: () => void;
  onOpenInvoice?: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  currentUser,
  pendingOrdersCount = 0,
  activeRepairsCount = 0,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onOpenRepairModal,
  onOpenTrackModal,
  onOpenAuthModal,
  onOpenAdminPortal,
  onOpenTechnicianPortal,
  onOpenInvoice,
  language,
  onLanguageChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allDrawerOpen, setAllDrawerOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setAllDrawerOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToSection('catalog-section');
  };

  return (
    <header className="amazon-header-root">
      {/* 1. Main Top Navigation Bar (Amazon Navy #131921) */}
      <div className="amazon-main-nav">
        <div className="amazon-nav-inner">
          {/* Brand Logo with Unique Dynamic Emblem */}
          <div 
            className="amazon-brand-link" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            title="Om Sai Power Tools & Repairing Center"
          >
            <BrandLogo size={42} lightText={true} />
          </div>

          {/* Delivery / Shop Counter Location Pill */}
          <div 
            className="amazon-location-pill" 
            onClick={() => scrollToSection('shop-info-section')}
            title="Collect & Inspect Orders at Station Road Counter"
          >
            <MapPin size={17} className="amazon-pin-icon" />
            <div className="location-text-group">
              <span className="location-label">{getTranslation('nav_pickup_at', language)}</span>
              <span className="location-destination">{getTranslation('nav_location', language)}</span>
            </div>
          </div>

          {/* Amazon-Style Unified Search Bar */}
          <form className="amazon-search-bar" onSubmit={handleSearchSubmit}>
            <div className="search-category-dropdown">
              <select 
                value={selectedCategory} 
                onChange={(e) => {
                  onSelectCategory(e.target.value as ProductCategory);
                  scrollToSection('catalog-section');
                }}
                aria-label="Select product category"
              >
                <option value="all">{getTranslation('cat_all', language)}</option>
                <option value="power-tools">{getTranslation('cat_power_tools', language)}</option>
                <option value="spare-parts">{getTranslation('cat_spare_parts', language)}</option>
                <option value="accessories">{getTranslation('cat_accessories', language)}</option>
              </select>
              <ChevronDown size={12} className="select-arrow" />
            </div>

            <input 
              type="text" 
              className="search-input-field" 
              placeholder={getTranslation('nav_search_placeholder', language)} 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />

            <button type="submit" className="search-submit-btn" aria-label="Search catalog">
              <Search size={19} />
            </button>
          </form>

          {/* Interactive Multi-Language Dropdown */}
          <div className="amazon-lang-pill-container">
            <button 
              type="button"
              className="amazon-lang-pill"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              title="Change Language"
              aria-label="Change language"
            >
              <span className="flag-icon">🇮🇳</span>
              <span className="lang-code">
                {language === 'hi' ? 'HI' : 'EN'}
              </span>
              <ChevronDown size={11} className="lang-caret" />
            </button>

            {langMenuOpen && (
              <div className="amazon-lang-dropdown">
                <div className="lang-dropdown-header">
                  <span>Language / भाषा</span>
                </div>
                <button 
                  type="button"
                  className={`lang-option ${language === 'en' ? 'active' : ''}`}
                  onClick={() => { onLanguageChange('en'); setLangMenuOpen(false); }}
                >
                  <span className="lang-radio">{language === 'en' ? '●' : '○'}</span>
                  <span className="lang-label">English (EN)</span>
                  <span className="lang-badge">Default</span>
                </button>
                <button 
                  type="button"
                  className={`lang-option ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => { onLanguageChange('hi'); setLangMenuOpen(false); }}
                >
                  <span className="lang-radio">{language === 'hi' ? '●' : '○'}</span>
                  <span className="lang-label">हिंदी (Hindi)</span>
                  <span className="lang-badge">Convert</span>
                </button>
              </div>
            )}
          </div>

          {/* Account & Lists */}
          <div 
            className="amazon-nav-account" 
            onClick={onOpenAuthModal}
            title={currentUser ? `Signed in as ${currentUser.displayName}` : 'Sign in to manage orders'}
          >
            <span className="account-greeting">
              {getTranslation('nav_hello', language)}, {currentUser ? currentUser.displayName.split(' ')[0] : getTranslation('nav_sign_in', language)}
            </span>
            <span className="account-action">
              {getTranslation('nav_account_staff', language)} ▾
            </span>
            {currentUser && (
              <span className={`account-role-tag role-${currentUser.role}`}>
                {currentUser.role}
              </span>
            )}
          </div>

          {/* Returns & Live Repair Tracking */}
          <div 
            className="amazon-nav-returns" 
            onClick={onOpenTrackModal}
            title="Track repair progress with your ticket reference"
          >
            <span className="returns-small">{getTranslation('nav_returns', language)}</span>
            <span className="returns-bold">{getTranslation('nav_repairs_track', language)}</span>
            {activeRepairsCount > 0 && (
              <span className="nav-pulse-badge">{activeRepairsCount}</span>
            )}
          </div>

          {/* Cart with Amazon Badge */}
          <div 
            className="amazon-nav-cart" 
            onClick={onOpenCart}
            title="Review counter reservation items"
          >
            <div className="cart-icon-wrapper">
              <ShoppingCart size={26} />
              <span className="amazon-cart-count">{cartCount}</span>
            </div>
            <span className="cart-text-label">{getTranslation('nav_cart', language)}</span>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="amazon-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* 2. Secondary Amazon Sub-Navbar (Navy #232f3e) */}
      <div className="amazon-sub-nav">
        <div className="amazon-sub-inner">
          <div className="sub-nav-left">
            <button 
              className="sub-nav-all-btn"
              onClick={() => scrollToSection('catalog-section')}
            >
              <Menu size={16} />
              <span>{getTranslation('cat_all', language)}</span>
            </button>

            <button 
              className={`sub-nav-link ${selectedCategory === 'power-tools' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('power-tools');
                scrollToSection('catalog-section');
              }}
            >
              {getTranslation('cat_power_tools', language)}
            </button>

            <button 
              className={`sub-nav-link ${selectedCategory === 'spare-parts' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('spare-parts');
                scrollToSection('catalog-section');
              }}
            >
              {getTranslation('cat_spare_parts', language)}
            </button>

            <button 
              className={`sub-nav-link ${selectedCategory === 'accessories' ? 'active' : ''}`}
              onClick={() => {
                onSelectCategory('accessories');
                scrollToSection('catalog-section');
              }}
            >
              {getTranslation('cat_accessories', language)}
            </button>

            <button 
              className="sub-nav-link highlight"
              onClick={onOpenRepairModal}
            >
              <Wrench size={14} />
              <span>{getTranslation('nav_book_repair_btn', language)}</span>
            </button>

            <button 
              className="sub-nav-link"
              onClick={onOpenTrackModal}
            >
              <Search size={14} />
              <span>{getTranslation('nav_repairs_track', language)}</span>
            </button>

            {onOpenInvoice && (
              <button 
                className="sub-nav-link"
                onClick={onOpenInvoice}
                title="View or search bills and tax invoices"
              >
                <FileText size={14} />
                <span>{language === 'hi' ? 'बिल / रसीद' : 'Bill / Invoice'}</span>
              </button>
            )}

            {/* Staff Portals for Owner (Himani) & Technicians */}
            {currentUser?.role === 'owner' && onOpenAdminPortal && (
              <button 
                className="sub-nav-staff-pill owner"
                onClick={onOpenAdminPortal}
              >
                <span>Owner Portal</span>
                {pendingOrdersCount > 0 && (
                  <span className="staff-badge">{pendingOrdersCount}</span>
                )}
              </button>
            )}

            {currentUser?.role === 'technician' && onOpenTechnicianPortal && (
              <button 
                className="sub-nav-staff-pill tech"
                onClick={onOpenTechnicianPortal}
              >
                <Wrench size={13} />
                <span>Tech Bench</span>
                {activeRepairsCount > 0 && (
                  <span className="staff-badge">{activeRepairsCount}</span>
                )}
              </button>
            )}
          </div>

          <div className="sub-nav-right">
            <span className="sub-guarantee-pill">
              <CheckCircle size={13} />
              <span>{getTranslation('nav_zero_payment', language)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="amazon-mobile-drawer">
          <div className="mobile-drawer-header">
            <div className="mobile-user-greeting">
              <UserIcon size={20} />
              <span>{getTranslation('nav_hello', language)}, {currentUser ? currentUser.displayName : getTranslation('nav_sign_in', language)}</span>
            </div>
            <button className="mobile-close-btn" onClick={() => setMobileMenuOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="mobile-drawer-body">
            {/* Mobile Language Switcher for Village Customers */}
            <div className="mobile-lang-bar">
              <span className="mobile-lang-title">Language / भाषा:</span>
              <div className="mobile-lang-options">
                <button 
                  type="button" 
                  className={`mobile-lang-btn ${language === 'en' ? 'active' : ''}`}
                  onClick={() => onLanguageChange('en')}
                >
                  English (Default)
                </button>
                <button 
                  type="button" 
                  className={`mobile-lang-btn ${language === 'hi' ? 'active' : ''}`}
                  onClick={() => onLanguageChange('hi')}
                >
                  हिंदी (Convert to Hindi)
                </button>
              </div>
            </div>

            <div className="mobile-section-heading">{getTranslation('nav_all_departments', language)}</div>
            <button 
              className="mobile-drawer-item"
              onClick={() => {
                onSelectCategory('all');
                scrollToSection('catalog-section');
              }}
            >
              {getTranslation('cat_all', language)}
            </button>
            <button 
              className="mobile-drawer-item"
              onClick={() => {
                onSelectCategory('power-tools');
                scrollToSection('catalog-section');
              }}
            >
              {getTranslation('cat_power_tools', language)}
            </button>
            <button 
              className="mobile-drawer-item"
              onClick={() => {
                onSelectCategory('spare-parts');
                scrollToSection('catalog-section');
              }}
            >
              {getTranslation('cat_spare_parts', language)}
            </button>
            <button 
              className="mobile-drawer-item"
              onClick={() => {
                onSelectCategory('accessories');
                scrollToSection('catalog-section');
              }}
            >
              {getTranslation('cat_accessories', language)}
            </button>

            <div className="mobile-section-heading">Workshop Services</div>
            <button 
              className="mobile-drawer-item highlight"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenRepairModal();
              }}
            >
              <Wrench size={16} />
              <span>{getTranslation('nav_book_repair_btn', language)}</span>
            </button>
            <button 
              className="mobile-drawer-item"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrackModal();
              }}
            >
              <Search size={16} />
              <span>{getTranslation('nav_repairs_track', language)}</span>
            </button>
            {onOpenInvoice && (
              <button 
                className="mobile-drawer-item"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInvoice();
                }}
              >
                <FileText size={16} />
                <span>{language === 'hi' ? 'बिल / रसीद देखें' : 'View Bill / Invoice'}</span>
              </button>
            )}

            {currentUser?.role === 'owner' && onOpenAdminPortal && (
              <button 
                className="mobile-drawer-item owner-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminPortal();
                }}
              >
                Owner Portal (Himani) &bull; {pendingOrdersCount} Pending
              </button>
            )}

            <div className="mobile-section-heading">Workshop Contact & Hours</div>
            <div className="mobile-contact-line">
              <PhoneCall size={14} />
              <span>{SHOP_INFO.phone}</span>
            </div>
            <div className="mobile-contact-line">
              <Clock size={14} />
              <span>Mon-Sat: 9:00 AM – 8:30 PM</span>
            </div>
            <div className="mobile-contact-line">
              <MapPin size={14} />
              <span>Station Road, Pimpri-Chinchwad</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
