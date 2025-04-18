import React, { useState, useEffect } from 'react';
import HelloButton from './components/HelloButton';
import Login from './components/Login';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const username = sessionStorage.getItem('username');
    if (username) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = (): void => {
    sessionStorage.removeItem('username');
    setIsLoggedIn(false);
    setMessage('');
  };

  return (
    <>
      <div className="ribbon">
        <div className="ribbon-title">
          <h1>TypeScript Office App</h1>
        </div>
      </div>
      
      <div className="App">
        <div className="card">
          <h2 className="card-title">Welcome to TypeScript Office App</h2>
          
          {isLoggedIn ? (
            <>
              <div className="user-info">
                <p>Welcome, {sessionStorage.getItem('username')}!</p>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
              
              <div className="card">
                <h3 className="card-title">Hello Service</h3>
                <HelloButton setMessage={setMessage} />
                {message && <p className="message">{message}</p>}
              </div>
            </>
          ) : (
            <Login onLoginSuccess={() => setIsLoggedIn(true)} />
          )}
        </div>
      </div>
    </>
  );
};

export default App; 