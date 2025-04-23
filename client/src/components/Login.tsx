import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  onLoginSuccess: (userData: { username: string; role: string }) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Basic validation
    if (!username.trim()) {
      setError('Please enter your username.');
      setIsLoading(false);
      return;
    }

    try {
      // Send login request to backend for validation
      const response = await axios.post('/api/login', { username });
      
      if (response.data.success) {
        // Store username and role in session storage for persistence
        sessionStorage.setItem('username', response.data.user.username);
        sessionStorage.setItem('userRole', response.data.user.role);
        
        // Notify parent component of successful login
        onLoginSuccess({ 
          username: response.data.user.username, 
          role: response.data.user.role 
        });
      } else {
        setError(response.data.message || 'Invalid username. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to verify login. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-intro">
        <h1>Employee Portal</h1>
        <p>Please sign in to access your account.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            disabled={isLoading}
            autoFocus
          />
        </div>
        
        <button 
          type="submit" 
          className="office-button" 
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      
      <div className="login-help">
        <p>Please enter your username to sign in.</p>
        <p>If you don't have an account, contact your system administrator.</p>
      </div>
    </div>
  );
};

export default Login; 