import React, { useState } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSendMessage = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      text: newMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setIsLoading(true);
    setNewMessage('');
    
    try {
      // Send message to server
      const response = await axios.post('/api/chat', { message: newMessage });
      
      // Add bot response
      const botMessage: Message = {
        text: response.data.message,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error sending message to chat bot:', error);
      
      // Add error message
      const errorMessage: Message = {
        text: 'Sorry, I encountered an error. Please try again later.',
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}
          >
            <div className="message-content">
              <p>{msg.text}</p>
            </div>
            <div className="message-timestamp">
              {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message bot-message">
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>
      
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button" 
          disabled={isLoading || !newMessage.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot; 