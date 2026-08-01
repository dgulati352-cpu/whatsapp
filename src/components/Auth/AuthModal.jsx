import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { 
  signUpWithEmail, 
  logInWithEmail, 
  logInWithGoogle, 
  logOut, 
  setupRecaptcha, 
  sendPhoneOtp 
} from '../../firebase';
import { X, Mail, Lock, Phone, KeyRound, LogOut, CheckCircle, ShieldAlert } from 'lucide-react';

export const AuthModal = ({ onClose }) => {
  const { user, setUser } = useWhatsApp();
  const [authMethod, setAuthMethod] = useState('email'); // 'email' | 'google' | 'phone'
  const [isSignUp, setIsSignUp] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+91');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      let res;
      if (isSignUp) {
        res = await signUpWithEmail(email, password);
        setSuccessMsg('Account created successfully!');
      } else {
        res = await logInWithEmail(email, password);
        setSuccessMsg('Signed in successfully!');
      }

      if (res.user) {
        setUser((prev) => ({
          ...prev,
          name: res.user.displayName || res.user.email.split('@')[0],
          avatar: res.user.photoURL || prev.avatar,
          email: res.user.email,
          uid: res.user.uid
        }));
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await logInWithGoogle();
      if (res.user) {
        setUser((prev) => ({
          ...prev,
          name: res.user.displayName,
          avatar: res.user.photoURL || prev.avatar,
          email: res.user.email,
          uid: res.user.uid
        }));
        setSuccessMsg(`Welcome, ${res.user.displayName}!`);
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const appVerifier = setupRecaptcha('recaptcha-container');
      const confirmation = await sendPhoneOtp(phone, appVerifier);
      setConfirmationResult(confirmation);
      setSuccessMsg('Verification code sent to your phone!');
    } catch (err) {
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await confirmationResult.confirm(otp);
      if (res.user) {
        setUser((prev) => ({
          ...prev,
          name: phone,
          phone: phone,
          uid: res.user.uid
        }));
        setSuccessMsg('Phone verified successfully!');
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      setErrorMsg('Invalid OTP code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await logOut();
    setUser((prev) => ({
      ...prev,
      name: 'Guest User',
      email: null,
      uid: null
    }));
    setSuccessMsg('Signed out successfully.');
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)', width: '420px', maxWidth: '92vw',
        borderRadius: '16px', border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Firebase Authentication</h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* ReCAPTCHA invisible container */}
        <div id="recaptcha-container" />

        {/* Body content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {errorMsg && (
            <div style={{
              backgroundColor: 'rgba(234, 67, 53, 0.15)', color: '#ea4335',
              padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <ShieldAlert size={16} /> {errorMsg}
            </div>
          )}

          {successMsg && (
            <div style={{
              backgroundColor: 'rgba(0, 168, 132, 0.15)', color: 'var(--accent)',
              padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}

          {/* Auth Method Selector Tabs */}
          <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <button 
              onClick={() => setAuthMethod('email')}
              className={`filter-chip ${authMethod === 'email' ? 'active' : ''}`}
            >
              Email & Password
            </button>
            <button 
              onClick={() => setAuthMethod('google')}
              className={`filter-chip ${authMethod === 'google' ? 'active' : ''}`}
            >
              Google
            </button>
            <button 
              onClick={() => setAuthMethod('phone')}
              className={`filter-chip ${authMethod === 'phone' ? 'active' : ''}`}
            >
              Phone SMS
            </button>
          </div>

          {/* Email / Password Form */}
          {authMethod === 'email' && (
            <form onSubmit={handleEmailAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', padding: '10px 12px', gap: '10px' }}>
                <Mail size={18} style={{ color: 'var(--text-secondary)' }} />
                <input 
                  type="email" 
                  placeholder="Email Address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', flex: 1, fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', padding: '10px 12px', gap: '10px' }}>
                <Lock size={18} style={{ color: 'var(--text-secondary)' }} />
                <input 
                  type="password" 
                  placeholder="Password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', flex: 1, fontSize: '14px' }}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: 'var(--accent)', color: '#111b21', border: 'none',
                  borderRadius: '8px', padding: '10px', fontWeight: 600, fontSize: '14px',
                  cursor: 'pointer', marginTop: '6px'
                }}
              >
                {loading ? 'Processing...' : isSignUp ? 'Sign Up with Email' : 'Sign In with Email'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '4px' }} onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </div>
            </form>
          )}

          {/* Google Sign-In */}
          {authMethod === 'google' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', padding: '10px 0' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                Sign in quickly using your official Google Account
              </p>
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  backgroundColor: '#ffffff', color: '#111b21', border: 'none',
                  borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '14.5px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: 18, height: 18 }} />
                {loading ? 'Connecting Google...' : 'Continue with Google'}
              </button>
            </div>
          )}

          {/* Phone SMS Form */}
          {authMethod === 'phone' && (
            <div>
              {!confirmationResult ? (
                <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', padding: '10px 12px', gap: '10px' }}>
                    <Phone size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input 
                      type="tel" 
                      placeholder="+91 98765 43210"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', flex: 1, fontSize: '14px' }}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: 'var(--accent)', color: '#111b21', border: 'none',
                      borderRadius: '8px', padding: '10px', fontWeight: 600, fontSize: '14px',
                      cursor: 'pointer', marginTop: '6px'
                    }}
                  >
                    {loading ? 'Sending SMS...' : 'Send SMS Verification Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', padding: '10px 12px', gap: '10px' }}>
                    <KeyRound size={18} style={{ color: 'var(--text-secondary)' }} />
                    <input 
                      type="text" 
                      placeholder="Enter 6-digit OTP"
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', flex: 1, fontSize: '14px' }}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: 'var(--accent)', color: '#111b21', border: 'none',
                      borderRadius: '8px', padding: '10px', fontWeight: 600, fontSize: '14px',
                      cursor: 'pointer', marginTop: '6px'
                    }}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP Code'}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* User Status / Logout Option */}
          {user.uid && (
            <button 
              onClick={handleSignOut}
              style={{
                backgroundColor: 'rgba(234, 67, 53, 0.12)', color: '#ea4335', border: 'none',
                borderRadius: '8px', padding: '10px', fontWeight: 600, fontSize: '14px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                marginTop: '10px'
              }}
            >
              <LogOut size={16} /> Sign Out ({user.email || user.name})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
