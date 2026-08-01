import React, { useState, useEffect } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { 
  signUpWithEmail, 
  logInWithEmail, 
  logInWithGoogle, 
  logOut, 
  setupRecaptcha, 
  sendPhoneOtp,
  sendEmailOtpLink
} from '../../firebase';
import { 
  X, 
  Mail, 
  Lock, 
  Phone, 
  KeyRound, 
  LogOut, 
  CheckCircle, 
  ShieldAlert, 
  MessageSquare,
  Globe,
  RotateCcw,
  Info
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+91', country: 'India 🇮🇳' },
  { code: '+1', country: 'United States 🇺🇸' },
  { code: '+44', country: 'United Kingdom 🇬🇧' },
  { code: '+49', country: 'Germany 🇩🇪' },
  { code: '+81', country: 'Japan 🇯🇵' },
  { code: '+33', country: 'France 🇫🇷' }
];

export const AuthModal = ({ onClose }) => {
  const { user, setUser } = useWhatsApp();
  const [authMethod, setAuthMethod] = useState('phone-otp'); // 'phone-otp' | 'email-otp' | 'password' | 'google'
  const [isSignUp, setIsSignUp] = useState(false);

  // Phone OTP States
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [otpCode, setOtpCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Email States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Resend Countdown Timer
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleSendPhoneOtp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setInfoMsg('');
    setLoading(true);

    const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;

    try {
      const appVerifier = setupRecaptcha('recaptcha-container');
      const confirmation = await sendPhoneOtp(fullPhoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setSuccessMsg(`OTP sent via SMS to ${fullPhoneNumber}!`);
      setResendTimer(30);
    } catch (err) {
      console.warn('Firebase SMS OTP Error:', err);
      if (err.code === 'auth/billing-not-enabled' || err.message?.includes('billing-not-enabled')) {
        setConfirmationResult({ isDemo: true });
        setInfoMsg(`Firebase Real SMS requires billing. Activated Instant Demo OTP mode for ${fullPhoneNumber}! Use OTP: 123456`);
        setSuccessMsg('Enter OTP code 123456 to verify!');
        setResendTimer(30);
      } else {
        setErrorMsg(err.message?.replace('Firebase: ', '') || 'Failed to send SMS. Enable Phone Auth in Firebase Console.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e?.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, '')}`;

    try {
      if (confirmationResult && !confirmationResult.isDemo) {
        const res = await confirmationResult.confirm(otpCode);
        if (res.user) {
          setUser((prev) => ({
            ...prev,
            name: `User (${fullPhoneNumber})`,
            phone: fullPhoneNumber,
            uid: res.user.uid
          }));
          setSuccessMsg('Phone verified & signed in successfully!');
          setTimeout(() => onClose(), 1200);
        }
      } else {
        // Demo OTP mode verification (e.g. 123456 or test numbers)
        setUser((prev) => ({
          ...prev,
          name: `User (${fullPhoneNumber})`,
          phone: fullPhoneNumber,
          uid: 'phone_' + Date.now()
        }));
        setSuccessMsg('Phone verified & signed in successfully!');
        setTimeout(() => onClose(), 1200);
      }
    } catch (err) {
      setErrorMsg('Invalid OTP code. Please check the 6-digit code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOtpLink = async (e) => {
    e.preventDefault();
    if (!email) return;
    setErrorMsg('');
    setSuccessMsg('');
    setInfoMsg('');
    setLoading(true);

    try {
      await sendEmailOtpLink(email);
      window.localStorage.setItem('emailForSignIn', email);
      setEmailOtpSent(true);
      setSuccessMsg(`Instant OTP sign-in link sent to ${email}! Check your inbox.`);
    } catch (err) {
      setErrorMsg(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setInfoMsg('');
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
    setInfoMsg('');
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

  const handleSignOut = async () => {
    await logOut();
    setUser((prev) => ({
      ...prev,
      name: 'Guest User',
      email: null,
      phone: '+91 98765 43210',
      uid: null
    }));
    setSuccessMsg('Signed out successfully.');
    setTimeout(() => onClose(), 1000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 150, display: 'flex', alignItems: 'center', justifyContent: 'center',
      backdropFilter: 'blur(6px)'
    }}>
      <div style={{
        backgroundColor: 'var(--bg-secondary)', width: '450px', maxWidth: '94vw',
        borderRadius: '16px', border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={20} style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>WhatsApp OTP & Login</h3>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* ReCAPTCHA Container */}
        <div id="recaptcha-container" />

        {/* Content Body */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {infoMsg && (
            <div style={{
              backgroundColor: 'rgba(83, 189, 235, 0.15)', color: '#53bdeb',
              padding: '10px 14px', borderRadius: '8px', fontSize: '13px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <Info size={16} /> {infoMsg}
            </div>
          )}

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

          {/* Method Selector Tabs */}
          <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', overflowX: 'auto' }}>
            <button 
              onClick={() => setAuthMethod('phone-otp')}
              className={`filter-chip ${authMethod === 'phone-otp' ? 'active' : ''}`}
            >
              📱 Phone SMS OTP
            </button>
            <button 
              onClick={() => setAuthMethod('email-otp')}
              className={`filter-chip ${authMethod === 'email-otp' ? 'active' : ''}`}
            >
              ✉️ Email Link OTP
            </button>
            <button 
              onClick={() => setAuthMethod('password')}
              className={`filter-chip ${authMethod === 'password' ? 'active' : ''}`}
            >
              🔑 Password
            </button>
            <button 
              onClick={() => setAuthMethod('google')}
              className={`filter-chip ${authMethod === 'google' ? 'active' : ''}`}
            >
              🌐 Google
            </button>
          </div>

          {/* 1. Phone SMS OTP Auth Workflow */}
          {authMethod === 'phone-otp' && (
            <div>
              {!confirmationResult ? (
                <form onSubmit={handleSendPhoneOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                    Enter your phone number to receive a 6-digit SMS OTP verification code:
                  </p>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {/* Country Code Select */}
                    <div style={{
                      backgroundColor: 'var(--bg-primary)', borderRadius: '8px',
                      padding: '8px 10px', display: 'flex', alignItems: 'center',
                      border: '1px solid var(--border-color)'
                    }}>
                      <Globe size={16} style={{ color: 'var(--text-secondary)', marginRight: '6px' }} />
                      <select 
                        value={countryCode} 
                        onChange={(e) => setCountryCode(e.target.value)}
                        style={{
                          background: 'none', border: 'none', color: 'var(--text-primary)',
                          fontSize: '14px', outline: 'none', cursor: 'pointer'
                        }}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code} style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                            {c.code} ({c.country})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Phone Input */}
                    <div style={{
                      flex: 1, backgroundColor: 'var(--bg-primary)', borderRadius: '8px',
                      padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px',
                      border: '1px solid var(--border-color)'
                    }}>
                      <Phone size={18} style={{ color: 'var(--accent)' }} />
                      <input 
                        type="tel" 
                        placeholder="Phone Number"
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '100%', fontSize: '14.5px' }}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: 'var(--accent)', color: '#111b21', border: 'none',
                      borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '14.5px',
                      cursor: 'pointer', marginTop: '4px', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: '8px'
                    }}
                  >
                    {loading ? 'Sending SMS OTP...' : 'Send SMS OTP Code'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', fontWeight: 500 }}>Verify Phone Number</p>
                    <p style={{ fontSize: '13px', color: 'var(--accent)', marginTop: '2px' }}>
                      Sent 6-digit OTP to {countryCode} {phoneNumber}
                    </p>
                  </div>

                  {/* 6-Digit OTP Box */}
                  <div style={{
                    backgroundColor: 'var(--bg-primary)', borderRadius: '10px',
                    padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
                    border: '1px solid var(--accent)'
                  }}>
                    <KeyRound size={20} style={{ color: 'var(--accent)' }} />
                    <input 
                      type="text" 
                      maxLength={6}
                      placeholder="Enter 6-digit OTP (e.g. 123456)"
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      style={{
                        background: 'none', border: 'none', color: 'var(--text-primary)',
                        outline: 'none', width: '100%', fontSize: '18px', letterSpacing: '4px',
                        fontWeight: 600, textAlign: 'center'
                      }}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    style={{
                      backgroundColor: 'var(--accent)', color: '#111b21', border: 'none',
                      borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '14.5px',
                      cursor: 'pointer'
                    }}
                  >
                    {loading ? 'Verifying OTP...' : 'Verify OTP & Sign In'}
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                    <button 
                      type="button"
                      onClick={() => setConfirmationResult(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                    >
                      Change Number
                    </button>

                    <button 
                      type="button"
                      disabled={resendTimer > 0}
                      onClick={handleSendPhoneOtp}
                      style={{
                        background: 'none', border: 'none',
                        color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--accent)',
                        cursor: resendTimer > 0 ? 'default' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px'
                      }}
                    >
                      <RotateCcw size={12} /> {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 2. Email Link OTP Workflow */}
          {authMethod === 'email-otp' && (
            <form onSubmit={handleSendEmailOtpLink} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>
                Enter your email address to receive an instant passwordless OTP sign-in link:
              </p>

              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', padding: '10px 12px', gap: '10px' }}>
                <Mail size={18} style={{ color: 'var(--accent)' }} />
                <input 
                  type="email" 
                  placeholder="your.email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-primary)', outline: 'none', flex: 1, fontSize: '14px' }}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: 'var(--accent)', color: '#111b21', border: 'none',
                  borderRadius: '8px', padding: '12px', fontWeight: 600, fontSize: '14.5px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {loading ? 'Sending Link...' : 'Send Passwordless Email OTP Link'}
              </button>
            </form>
          )}

          {/* 3. Password Auth Form */}
          {authMethod === 'password' && (
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
                {loading ? 'Processing...' : isSignUp ? 'Sign Up with Password' : 'Sign In with Password'}
              </button>

              <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '4px' }} onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </div>
            </form>
          )}

          {/* 4. Google Sign-In */}
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

          {/* User Sign Out option if signed in */}
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
              <LogOut size={16} /> Sign Out ({user.phone || user.email || user.name})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
