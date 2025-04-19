import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/login', { username });
      
      if (response.data.success) {
        // Store username in sessionStorage for simple auth state
        sessionStorage.setItem('username', username);
        onLoginSuccess(username);
      } else {
        setError('Login failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Username does not exist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h3 className="card-title">Sign in to Employee Portal</h3>
      
      <div className="login-intro">
        <p>Experience the joy of taking part in our community.</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={isLoading}
            placeholder="Enter your username"
            autoComplete="off"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className="office-button"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      
      <div className="login-help">
        <p>Available usernames: john, alice, bob, admin, pva</p>
      </div>
    </div>
  );
};

export default Login; 