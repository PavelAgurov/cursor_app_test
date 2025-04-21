import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
  isHtml?: boolean;
}

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('anonymous');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input field after messages change or loading state changes
  useEffect(() => {
    // Only focus if not in loading state
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [messages, isLoading]);

  // Get username from session storage when component mounts
  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
    
    // Set initial welcome message with username
    setMessages([{
      text: `Hello ${storedUsername || 'there'}! How can I help you today?`,
      isUser: false,
      timestamp: new Date()
    }]);
    
    // Focus input field on initial load
    inputRef.current?.focus();
  }, []);

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
      // Send message to server with username
      const response = await axios.post('/api/chat', { 
        message: newMessage,
        username: username
      });
      
      // Add bot response
      const botMessage: Message = {
        text: response.data.message,
        isUser: false,
        timestamp: new Date(),
        isHtml: true // Mark that this message contains HTML
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

  // Function to safely render HTML content
  const renderMessageContent = (msg: Message) => {
    if (msg.isHtml && !msg.isUser) {
      return (
        <div 
          className="message-content"
          dangerouslySetInnerHTML={{ __html: msg.text }}
        />
      );
    }
    
    return (
      <div className="message-content">
        <p>{msg.text}</p>
      </div>
    );
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`message ${msg.isUser ? 'user-message' : 'bot-message'}`}
          >
            {renderMessageContent(msg)}
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
        {/* Empty div for scroll reference */}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          ref={inputRef}
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