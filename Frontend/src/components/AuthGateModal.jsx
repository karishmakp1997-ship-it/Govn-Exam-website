import { useState } from 'react';
import { login as loginApi, requestSignupOtp, verifySignupOtp } from '../api/auth'; // adjust path if needed
import { useAuth } from '../context/AuthContext'; // adjust path if needed

function AuthGateModal() {
  const { login: setLoggedIn, authModalMode, setAuthModalMode, closeAuthModal } = useAuth();
  const mode = authModalMode;
  const setMode = setAuthModalMode;

  // ---- Login state ----
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // ---- Signup state ----
  const [step, setStep] = useState('details'); // 'details' | 'otp'
  const [signupForm, setSignupForm] = useState({ username: '', email: '', mobile_number: '', password: '' });
  const [otp, setOtp] = useState('');
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);

  // ---- Login handlers ----
  const handleLoginChange = (e) => setLoginForm({ ...loginForm, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (!loginForm.username || !loginForm.password) {
      setLoginError('Please enter your username and password.');
      return;
    }
    setLoginLoading(true);
    try {
      const data = await loginApi(loginForm);
      setLoggedIn(data.access);
      // No navigate needed — the moment isAuthenticated flips true, App.jsx unmounts this modal automatically
    } catch (err) {
      setLoginError('Invalid username or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // ---- Signup handlers ----
  const handleSignupChange = (e) => setSignupForm({ ...signupForm, [e.target.name]: e.target.value });

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setSignupError('');
    if (!signupForm.username || !signupForm.email || !signupForm.mobile_number || !signupForm.password) {
      setSignupError('Please fill in all required fields.');
      return;
    }
    setSignupLoading(true);
    try {
      await requestSignupOtp(signupForm);
      setStep('otp');
    } catch (err) {
      setSignupError('Something went wrong. Please check your details and try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setSignupError('');
    if (!otp || otp.length !== 6) {
      setSignupError('Enter the 6-digit OTP.');
      return;
    }
    setSignupLoading(true);
    try {
      const data = await verifySignupOtp({ mobile_number: signupForm.mobile_number, otp });
      setLoggedIn(data.access);
    } catch (err) {
      setSignupError('Incorrect or expired OTP.');
    } finally {
      setSignupLoading(false);
    }
  };

  const handleResend = async () => {
    setSignupError('');
    try {
      await requestSignupOtp(signupForm);
    } catch {
      setSignupError('Failed to resend OTP.');
    }
  };

  return (
    <div style={overlayStyle} onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal(); }}>
      <div style={cardStyle}>
        <button onClick={closeAuthModal} style={closeBtnStyle} aria-label="Close">✕</button>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={logoStyle}>V</div>
          <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>
            {mode === 'login' ? 'Welcome back' : step === 'otp' ? 'Verify your number' : 'Create your account'}
          </h2>
          <p style={{ fontSize: '13px', color: '#7c8398' }}>
            {mode === 'login'
              ? 'Log in to continue your exam preparation.'
              : step === 'otp'
              ? `Enter the 6-digit code sent to ${signupForm.mobile_number}`
              : "Start your exam preparation journey — it's free."}
          </p>
        </div>

        {/* Tab switcher — hidden during OTP step to avoid losing progress mid-verification */}
        {!(mode === 'signup' && step === 'otp') && (
          <div style={tabRowStyle}>
            <button
              onClick={() => setMode('login')}
              style={mode === 'login' ? tabActiveStyle : tabStyle}
            >
              Log In
            </button>
            <button
              onClick={() => setMode('signup')}
              style={mode === 'signup' ? tabActiveStyle : tabStyle}
            >
              Sign Up
            </button>
          </div>
        )}

        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input name="username" placeholder="Username" value={loginForm.username} onChange={handleLoginChange} style={inputStyle} />
            <input name="password" type="password" placeholder="Password" value={loginForm.password} onChange={handleLoginChange} style={inputStyle} />
            {loginError && <p style={errorStyle}>{loginError}</p>}
            <button type="submit" disabled={loginLoading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '11px' }}>
              {loginLoading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        )}

        {mode === 'signup' && step === 'details' && (
          <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input name="username" placeholder="Full name" value={signupForm.username} onChange={handleSignupChange} style={inputStyle} />
            <input name="mobile_number" placeholder="Mobile number (WhatsApp)" value={signupForm.mobile_number} onChange={handleSignupChange} style={inputStyle} />
            <input name="email" type="email" placeholder="Email address" value={signupForm.email} onChange={handleSignupChange} style={inputStyle} />
            <input name="password" type="password" placeholder="Password" value={signupForm.password} onChange={handleSignupChange} style={inputStyle} />
            {signupError && <p style={errorStyle}>{signupError}</p>}
            <button type="submit" disabled={signupLoading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '11px' }}>
              {signupLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {mode === 'signup' && step === 'otp' && (
          <>
            <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                style={{ ...inputStyle, textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }}
                inputMode="numeric"
              />
              {signupError && <p style={errorStyle}>{signupError}</p>}
              <button type="submit" disabled={signupLoading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '11px' }}>
                {signupLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            </form>
            <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '16px', color: '#7c8398' }}>
              Didn't get it? <button onClick={handleResend} style={linkBtnStyle}>Resend OTP</button>
            </p>
            <p style={{ textAlign: 'center', fontSize: '12.5px', marginTop: '8px' }}>
              <button onClick={() => setStep('details')} style={linkBtnStyle}>← Edit details</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const cardStyle = {
  position: 'relative',
  background: '#fff',
  borderRadius: '16px',
  padding: '36px',
  width: '380px',
  maxWidth: '90vw',
  boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
};

const closeBtnStyle = {
  position: 'absolute',
  top: '14px', right: '14px',
  width: '28px', height: '28px',
  borderRadius: '50%',
  border: 'none',
  background: '#f1f4f9',
  color: '#7c8398',
  fontSize: '14px',
  cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

const logoStyle = {
  width: '40px', height: '40px', borderRadius: '10px',
  background: 'linear-gradient(135deg, #1d4ed8, #0f9d58)',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: '#fff', fontWeight: 'bold', margin: '0 auto 10px',
};

const inputStyle = { padding: '10px 14px', border: '1px solid #e6e9f2', borderRadius: '10px', fontSize: '14px' };
const errorStyle = { color: '#c23a3a', fontSize: '12.5px' };
const linkBtnStyle = { color: '#1d4ed8', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 };

const tabRowStyle = { display: 'flex', gap: '8px', marginBottom: '18px', background: '#f1f4f9', borderRadius: '10px', padding: '4px' };
const tabStyle = { flex: 1, padding: '9px', border: 'none', borderRadius: '8px', background: 'transparent', color: '#7c8398', fontWeight: '600', fontSize: '13.5px', cursor: 'pointer' };
const tabActiveStyle = { ...tabStyle, background: '#fff', color: '#1d4ed8', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' };

export default AuthGateModal;