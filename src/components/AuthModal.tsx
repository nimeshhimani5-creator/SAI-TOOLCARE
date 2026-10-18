import React, { useState } from 'react';
import { 
  X, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  KeyRound, 
  ArrowRight 
} from 'lucide-react';
import { authService, DEMO_ACCOUNTS } from '../services/authService';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onAuthSuccess: (user: UserProfile) => void;
  onSignOut: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const user = await authService.signIn(email, password);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Check email and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      const user = await authService.register(email, password, displayName, phone);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register account.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setLoading(true);
    try {
      const user = await authService.signIn(acc.email, acc.password);
      onAuthSuccess(user);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Quick login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content auth-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="header-icon-circle">
              <User size={20} />
            </div>
            <div>
              <h3 className="modal-title">
                {currentUser ? 'Your ToolCare Account' : 'Customer & Staff Portal'}
              </h3>
              <p className="modal-subtitle">
                {currentUser 
                  ? `Signed in as ${currentUser.displayName}` 
                  : 'Access repair status, counter reservations, and staff tools'}
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {currentUser ? (
            /* Logged in view */
            <div className="auth-profile-box">
              <div className="user-avatar-circle">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <h4 className="user-profile-name">{currentUser.displayName}</h4>
              <span className="user-profile-email">{currentUser.email}</span>

              <div className="user-role-badge-row">
                <span className={`role-pill role-${currentUser.role}`}>
                  <ShieldCheck size={14} />
                  Role: {currentUser.role.toUpperCase()}
                </span>
              </div>

              <div className="role-permissions-info">
                {currentUser.role === 'owner' && (
                  <p>✓ <strong>Owner Access:</strong> Full permission to manage products, adjust inventory, review counter orders, and assign repair jobs.</p>
                )}
                {currentUser.role === 'technician' && (
                  <p>✓ <strong>Technician Access:</strong> Bench access to update tool diagnosis, post estimates, and set machines to Ready for Collection.</p>
                )}
                {currentUser.role === 'customer' && (
                  <p>✓ <strong>Customer Access:</strong> Track your submitted tools, reserve parts for counter pickup, and view receipts.</p>
                )}
              </div>

              <div className="auth-actions-row mt-4">
                <button 
                  className="btn btn-secondary w-full"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                >
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign in / Register form */
            <div>
              {/* Quick Staff Testing Pills */}
              <div className="quick-staff-box">
                <div className="quick-staff-header">
                  <KeyRound size={14} className="text-primary" />
                  <span>1-Click Test Credentials (Firebase Phase 2):</span>
                </div>
                <div className="quick-staff-pills">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      className="demo-acc-btn"
                      onClick={() => handleQuickLogin(acc)}
                    >
                      <span className="demo-badge">{acc.role}</span>
                      <span className="demo-name">{acc.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tabs */}
              <div className="auth-tab-row">
                <button
                  type="button"
                  className={`auth-tab-btn ${activeTab === 'signin' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMsg(null);
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMsg(null);
                  }}
                >
                  Create Customer Account
                </button>
              </div>

              {errorMsg && (
                <div className="auth-error-banner">
                  <span>{errorMsg}</span>
                </div>
              )}

              {activeTab === 'signin' ? (
                <form onSubmit={handleSignIn} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <div className="input-with-icon">
                      <Mail size={16} className="input-icon" />
                      <input
                        type="email"
                        required
                        className="form-input with-icon"
                        placeholder="e.g., owner@saitoolcare.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="input-with-icon">
                      <Lock size={16} className="input-icon" />
                      <input
                        type="password"
                        required
                        className="form-input with-icon"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-full mt-3"
                    disabled={loading}
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In to Portal'}</span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="auth-form">
                  <div className="form-group">
                    <label className="form-label">Your Full Name</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g., Ramesh Contractor"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      required
                      className="form-input"
                      placeholder="e.g., ramesh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">WhatsApp / Contact Phone</label>
                    <input
                      type="tel"
                      required
                      className="form-input"
                      placeholder="e.g., 98230 12345"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      required
                      className="form-input"
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-full mt-3"
                    disabled={loading}
                  >
                    <span>{loading ? 'Creating Account...' : 'Register Customer Account'}</span>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
