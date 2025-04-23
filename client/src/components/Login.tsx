import React, { useState } from 'react';

interface LoginProps {
  onLoginSuccess: (userData: { username: string; role: string }) => void;
}

type UserRoles = {
  [key: string]: string;
};

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Basic validation
    if (!username.trim()) {
      setError('Please enter your username.');
      setIsLoading(false);
      return;
    }
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      // Valid usernames from users.yaml: john, alice, bob, admin, pva
      const validUsers: UserRoles = {
        'john': 'user',
        'alice': 'user',
        'bob': 'user',
        'admin': 'admin',
        'pva': 'admin'
      };

      const lowerUsername = username.toLowerCase();
      if (validUsers[lowerUsername]) {
        const role = validUsers[lowerUsername];
        // Store username in session storage for persistence
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('userRole', role);
        
        // Notify parent component of successful login
        onLoginSuccess({ username, role });
      } else {
        setError('Invalid username. Try john, alice, bob, admin, or pva.');
      }
      setIsLoading(false);
    }, 1000);
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
        <strong>Available usernames:</strong> john, alice, bob, admin, pva
      </div>
    </div>
  );
};

export default Login; 