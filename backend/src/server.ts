import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getUserByUsername, getAllUsers, getVacationRequests, addUser, isUserAdmin } from './services/dataService';
import { processChatMessage } from './services/llmService';

// Load environment variables
dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000');

// Log that we're ready to handle requests
console.log('Ready to handle requests, including vacation requests');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the backend!' });
});

// User validation endpoint
app.post('/api/login', (req: Request, res: Response) => {
  const { username } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  try {
    // Check if user exists
    const user = getUserByUsername(username);
    
    if (user) {
      res.json({ 
        success: true, 
        message: 'Login successful',
        user: {
          username: user.username,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Username does not exist' });
    }
  } catch (error) {
    console.error('Error validating user:', error);
    res.status(500).json({ success: false, message: 'Server error, please try again later' });
  }
});

// Add new user endpoint (admin only)
app.post('/api/users', (req: Request, res: Response) => {
  const { username, adminUsername, role = 'user' } = req.body;
  
  if (!username || !adminUsername) {
    return res.status(400).json({ error: 'Username and admin username are required' });
  }
  
  try {
    // Verify admin permissions using role
    const adminUser = getUserByUsername(adminUsername);
    
    if (!adminUser) {
      return res.status(401).json({ error: 'Invalid admin user' });
    }
    
    if (adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    // Add the new user with specified role
    const result = addUser(username, role as 'admin' | 'user');
    
    if (result) {
      res.status(201).json({ success: true, message: `User ${username} added successfully with role ${role}` });
    } else {
      res.status(409).json({ success: false, message: `User ${username} already exists` });
    }
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Chat bot endpoint with LLM integration
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, username } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Process the message using LLM, passing the username
    const response = await processChatMessage(message, username || 'anonymous');
    
    // Return the LLM response
    res.json({ message: response });
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ 
      message: 'Sorry, I encountered an error. Please try again later.' 
    });
  }
});

// Vacation requests endpoint (only accessible to admin)
app.get('/api/vacation-requests', (req: Request, res: Response) => {
  // Verify if user is admin
  const username = req.query.username as string;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  try {
    // Check if user exists
    const user = getUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    
    // Check admin role instead of specific usernames
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    // Get vacation requests directly from the file
    const vacationRequests = getVacationRequests();
    res.json({ requests: vacationRequests });
  } catch (error) {
    console.error('Error validating admin access:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Get all users endpoint (admin only)
app.get('/api/users', (req: Request, res: Response) => {
  // Verify if user is admin
  const username = req.query.username as string;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  try {
    // Check if user has admin role
    if (!isUserAdmin(username)) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    // Return all users
    const users = getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Add a new route for public user list (doesn't require authentication)
app.get('/api/valid-users', (req: Request, res: Response) => {
  try {
    // Get all users but only return their usernames and roles, no other sensitive data
    const users = getAllUsers().map(user => ({
      username: user.username,
      role: user.role
    }));
    res.json({ users });
  } catch (error) {
    console.error('Error retrieving valid users:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Start server
app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
}); 