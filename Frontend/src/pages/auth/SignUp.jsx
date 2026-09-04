import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestSignupOtp, verifySignupOtp } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

function SignUp() {
  const [step, setStep] = useState('details');
  const [form, setForm] = useState({ username: '', email: '', mobile_number: '', password: '' });
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setLoggedIn } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.email || !form.mobile_number || !form.password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      await requestSignupOtp(form);
      setStep('otp');
    } catch (err) {
      setError('Something went wrong. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length !== 6) {
      setError('Enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    try {
      const data = await verifySignupOtp({ mobile_number: form.mobile_number, otp: otp });
      setLoggedIn(data.access);
      navigate('/');
    } catch (err) {
      setError('Incorrect or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await requestSignupOtp(form);
    } catch (err) {
      setError('Failed to resend OTP.');
    }
  };

  const cardStyle = { background: '#fff', borderRadius: '16px', padding: '36px', width: '380px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' };
  const logoStyle = { width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #1d4ed8, #0f9d58)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', margin: '0 auto 10px' };
  const inputStyle = { padding: '10px 14px', border: '1px solid #e6e9f2', borderRadius: '10px', fontSize: '14px' };

  if (step === 'otp') {
    return (
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={logoStyle}>V</div>
          <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Verify your number</h2>
          <p style={{ fontSize: '13px', color: '#7c8398' }}>
            Enter the 6-digit code sent to {form.mobile_number}
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            name="otp"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
            style={{ ...inputStyle, textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }}
            inputMode="numeric"
          />
          {error && <p style={{ color: '#c23a3a', fontSize: '12.5px' }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '11px' }}>
            {loading ? 'Verifying...' : 'Verify and Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '16px', color: '#7c8398' }}>
          Didn't get it?{' '}
          <button onClick={handleResend} style={{ color: '#1d4ed8', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Resend OTP
          </button>
        </p>
        <p style={{ textAlign: 'center', fontSize: '12.5px', marginTop: '8px' }}>
          <button onClick={() => setStep('details')} style={{ color: '#7c8398', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            Back to edit details
          </button>
        </p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={logoStyle}>V</div>
        <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Create your account</h2>
        <p style={{ fontSize: '13px', color: '#7c8398' }}>Start your exam preparation journey - free.</p>
      </div>

      <form onSubmit={handleRequestOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input name="username" placeholder="Full name" value={form.username} onChange={handleChange} style={inputStyle} />
        <input name="mobile_number" placeholder="Mobile number" value={form.mobile_number} onChange={handleChange} style={inputStyle} />
        <input name="email" type="email" placeholder="Email address" value={form.email} onChange={handleChange} style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={inputStyle} />
        {error && <p style={{ color: '#c23a3a', fontSize: '12.5px' }}>{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '11px' }}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '16px', color: '#7c8398' }}>
        Already have an account? <Link to="/login" style={{ color: '#1d4ed8', fontWeight: '600' }}>Log in</Link>
      </p>
    </div>
  );
}

export default SignUp;