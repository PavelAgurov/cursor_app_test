import React, { useState, useEffect } from 'react';
import ChatBot from './components/ChatBot';
import VacationRequests from './components/VacationRequests';
import Login from './components/Login';
// Import SVG components from Dashboard
import { 
  RibbonIcon, 
  AlertIcon, 
  DocumentIcon,
  GiftIcon,
  ChartIcon,
  BoxIcon,
  DefaultAvatar
} from './components/DashboardIcons';

interface UserData {
  username: string;
  role: string;
}

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, title, description, onClick }) => {
  return (
    <div 
      className="dashboard-card" 
      style={{ backgroundColor: '#EEF3FF' }}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="dashboard-card-icon">
        {icon}
      </div>
      <h3 className="dashboard-card-title">{title}</h3>
      <p className="dashboard-card-description">{description}</p>
    </div>
  );
};

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [showChatBot, setShowChatBot] = useState<boolean>(false);
  const [showVacationRequests, setShowVacationRequests] = useState<boolean>(false);
  const [avatarError, setAvatarError] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    const storedRole = sessionStorage.getItem('userRole');
    
    if (storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setUserRole(storedRole || 'user');
    }
  }, []);

  const handleLogout = (): void => {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userRole');
    setIsLoggedIn(false);
    setUsername('');
    setUserRole('');
    setShowChatBot(false);
    setShowVacationRequests(false);
  };

  const handleLoginSuccess = (userData: UserData): void => {
    setIsLoggedIn(true);
    setUsername(userData.username);
    setUserRole(userData.role);
  };

  // Check if user has admin privileges based on role
  const isAdmin = userRole === 'admin';

  return (
    <div className={`App ${isLoggedIn ? 'dashboard-active' : ''}`}>
      {!isLoggedIn ? (
        <div className="card">
          <h2 className="card-title">Hello, welcome to the portal</h2>
          <Login onLoginSuccess={handleLoginSuccess} />
        </div>
      ) : (
        <>
          {showChatBot ? (
            <div className="card">
              <div className="card-header">
                <div className="dashboard-menu-container">
                  <h3 className="card-title dashboard-title">Chat Bot</h3>
                </div>
                <div className="dashboard-actions">
                  <button onClick={() => setShowChatBot(false)} className="back-button">Back</button>
                </div>
              </div>
              <ChatBot />
            </div>
          ) : showVacationRequests ? (
            <div className="card">
              <div className="card-header">
                <div className="dashboard-menu-container">
                  <h3 className="card-title dashboard-title">Vacation Requests</h3>
                </div>
                <div className="dashboard-actions">
                  <button onClick={() => setShowVacationRequests(false)} className="back-button">Back</button>
                </div>
              </div>
              <VacationRequests />
            </div>
          ) : (
            <div className="dashboard-view">
              <div className="dashboard-header" style={{ backgroundColor: '#FFCE7D' }}>
                <div className="dashboard-menu-container">
                  <h1 className="dashboard-title">My dashboard</h1>
                </div>
                <div className="dashboard-actions">
                  <div className="dashboard-profile">
                    {avatarError ? (
                      <DefaultAvatar />
                    ) : (
                      <img 
                        src="/assets/images/avatar.png" 
                        alt="Profile" 
                        className="dashboard-avatar" 
                        onError={() => setAvatarError(true)}
                      />
                    )}
                  </div>
                  <button onClick={handleLogout} className="logout-button dashboard-logout">Logout</button>
                </div>
              </div>
              
              <div className="dashboard-welcome">
                <p>Welcome, {username}! <span className="user-role">({userRole})</span></p>
              </div>

              <div className="dashboard-content">
                <div className="dashboard-grid">
                  <DashboardCard
                    icon={<RibbonIcon />}
                    title="Promotions"
                    description="Find best suitable promotions for your needs"
                  />
                  
                  <DashboardCard
                    icon={<AlertIcon />}
                    title="Raise a query"
                    description="Having a trouble? Raise a query to our service desk"
                  />
                  
                  <DashboardCard
                    icon={<DocumentIcon />}
                    title="Policies"
                    description="Get detailed information about policies in Odido"
                  />
                  
                  <DashboardCard
                    icon={<GiftIcon />}
                    title="Benefits"
                    description="Get detailed information about policies in Odido"
                  />
                  
                  <DashboardCard
                    icon={<ChartIcon />}
                    title="Title"
                    description="Lorem ipsum dolor sit amet"
                  />
                  
                  {isAdmin && (
                    <DashboardCard
                      icon={<BoxIcon />}
                      title="Vacation requests"
                      description="Manage vacation requests for your team"
                      onClick={() => setShowVacationRequests(true)}
                    />
                  )}
                </div>
              </div>

              <button 
                className="chatbot-button" 
                style={{ backgroundColor: '#FFAE7C' }}
                aria-label="Chat with bot"
                onClick={() => setShowChatBot(true)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V16C22 17.1 21.1 18 20 18H6L2 22V6C2 4.9 2.9 4 4 4Z" stroke="white" strokeWidth="2" fill="none" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default App; 