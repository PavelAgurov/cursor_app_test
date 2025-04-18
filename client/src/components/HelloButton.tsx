import React, { useState } from 'react';
import axios from 'axios';

interface HelloButtonProps {
  setMessage: (message: string) => void;
}

const HelloButton: React.FC<HelloButtonProps> = ({ setMessage }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = async (): Promise<void> => {
    setIsLoading(true);
    
    try {
      const response = await axios.get('/api/hello');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error fetching hello message:', error);
      setMessage('Error connecting to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hello-button-container">
      <p className="hello-description">
        Click the button below to get a greeting from the server.
      </p>
      <button 
        onClick={handleClick} 
        disabled={isLoading}
        className="office-button"
      >
        {isLoading ? 'Processing...' : 'Say Hello'}
      </button>
    </div>
  );
};

export default HelloButton; 