import React, { useState, useEffect } from 'react';
import ChatBot from './components/ChatBot';
import VacationRequests from './components/VacationRequests';
import Login from './components/Login';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [showChatBot, setShowChatBot] = useState<boolean>(false);
  const [showVacationRequests, setShowVacationRequests] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = (): void => {
    sessionStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
    setShowChatBot(false);
    setShowVacationRequests(false);
  };

  const handleLoginSuccess = (loggedInUsername: string): void => {
    setIsLoggedIn(true);
    setUsername(loggedInUsername);
  };

  // Check if user has admin privileges
  const isAdmin = username.toLowerCase() === 'admin' || username.toLowerCase() === 'pva';

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
                <p>Welcome, {username}!</p>
                <button onClick={handleLogout} className="logout-button">Logout</button>
              </div>
              
              {!showChatBot && !showVacationRequests && (
                <div className="action-buttons">
                  <div className="button-container">
                    <div className="office-button-card" onClick={() => setShowChatBot(true)}>
                      <div className="button-card-content">
                        <h3>Chat bot</h3>
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="office-button-card" onClick={() => setShowVacationRequests(true)}>
                        <div className="button-card-content">
                          <h3>Vacation requests</h3>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {showChatBot && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Chat Bot</h3>
                    <button onClick={() => setShowChatBot(false)} className="back-button">Back</button>
                  </div>
                  <ChatBot />
                </div>
              )}
              
              {showVacationRequests && (
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Vacation Requests</h3>
                    <button onClick={() => setShowVacationRequests(false)} className="back-button">Back</button>
                  </div>
                  <VacationRequests />
                </div>
              )}
            </>
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          )}
        </div>
      </div>
    </>
  );
};

export default App; 