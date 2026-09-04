import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../api/auth';
import { useAuth } from '../../context/AuthContext';

function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setLoggedIn } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.username || !form.password) {
      setError('Please enter your username and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await login(form);
      setLoggedIn(data.access);
      navigate('/my-exams');
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '36px', width: '380px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #1d4ed8, #0f9d58)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', margin: '0 auto 10px' }}>V</div>
        <h2 style={{ fontSize: '20px', marginBottom: '4px' }}>Welcome back</h2>
        <p style={{ fontSize: '13px', color: '#7c8398' }}>Log in to continue your preparation.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input name="username" placeholder="Username" value={form.username} onChange={handleChange} style={inputStyle} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} style={inputStyle} />

        {error && <p style={{ color: '#c23a3a', fontSize: '12.5px' }}>{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary" style={{ justifyContent: 'center', padding: '11px' }}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p style={{ textAlign: 'center', fontSize: '13px', marginTop: '16px', color: '#7c8398' }}>
        New here? <Link to="/signup" style={{ color: '#1d4ed8', fontWeight: '600' }}>Create an account</Link>
      </p>
    </div>
  );
}

const inputStyle = {
  padding: '10px 14px',
  border: '1px solid #e6e9f2',
  borderRadius: '10px',
  fontSize: '14px',
};

export default Login;