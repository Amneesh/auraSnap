import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../auth/firebase'; // make sure this points to your firebase.js file
import bgImage from '../assets/bg-image.webp'; // Adjust path as needed
import logo from '../assets/logo-img.png'
export default function Login() {
  const [email, setEmail] = useState('fanbhangrede@gmail.com');
  const [password, setPassword] = useState('fbd@webdevbc');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('Logged in:', user.email);

      // Optionally store login state if needed
      localStorage.setItem('user', JSON.stringify({ email: user.email }));
  
      const codeName = email.split('@')[0];
      localStorage.setItem('code', codeName);
      // Navigate to dashboard
      console.log('navigatig done');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page" style={{ backgroundImage: `url(${bgImage})` }}>
    <div className="login-container">
      <div className='login-form-header'>
        <h2>AuraSnap Login</h2>
        <img src={logo} alt="" />
      </div>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{ width: '100%', marginBottom: 10 }}
        />
         
        <button type="submit" disabled={loading} className='aurasnap-button'>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
  );
}
