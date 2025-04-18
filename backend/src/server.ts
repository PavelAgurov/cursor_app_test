import express, { Request, Response } from 'express';
import cors from 'cors';
import { getUsers, getVacationRequests, getChatResponses, addUser } from './services/dataService';

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000');

// Load vacation requests and chat responses data
let vacationRequests: any[];
let chatResponses: { [key: string]: string };

// Initialize data
try {
  vacationRequests = getVacationRequests();
  chatResponses = getChatResponses();
  
  console.log('Data loaded successfully from YAML files');
} catch (error) {
  console.error('Error loading data:', error);
  vacationRequests = [];
  chatResponses = {};
}

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
    // Read users directly from file each time
    const validUsers = getUsers();
    
    if (validUsers.includes(username.toLowerCase())) {
      res.json({ success: true, message: 'Login successful' });
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
  const { username, adminUsername } = req.body;
  
  if (!username || !adminUsername) {
    return res.status(400).json({ error: 'Username and admin username are required' });
  }
  
  try {
    // Verify admin permissions
    const validUsers = getUsers();
    const isAdmin = adminUsername.toLowerCase() === 'admin' || adminUsername.toLowerCase() === 'pva';
    
    if (!validUsers.includes(adminUsername.toLowerCase())) {
      return res.status(401).json({ error: 'Invalid admin user' });
    }
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    // Add the new user
    const result = addUser(username);
    
    if (result) {
      res.status(201).json({ success: true, message: `User ${username} added successfully` });
    } else {
      res.status(409).json({ success: false, message: `User ${username} already exists` });
    }
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Chat bot endpoint
app.post('/api/chat', (req: Request, res: Response) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Process the message
  const lowerCaseMessage = message.toLowerCase();
  let response = 'I\'m not sure how to respond to that. Can you try asking something else?';
  
  // Check for keywords in the message
  for (const keyword in chatResponses) {
    if (lowerCaseMessage.includes(keyword)) {
      response = chatResponses[keyword];
      break;
    }
  }
  
  // Add a slight delay to simulate processing
  setTimeout(() => {
    res.json({ message: response });
  }, 500);
});

// Vacation requests endpoint (only accessible to admin)
app.get('/api/vacation-requests', (req: Request, res: Response) => {
  // Verify if user is admin
  const username = req.query.username as string;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  try {
    // Read users directly from file to check if admin
    const validUsers = getUsers();
    const isAdmin = username.toLowerCase() === 'admin' || username.toLowerCase() === 'pva';
    
    if (!validUsers.includes(username.toLowerCase())) {
      return res.status(401).json({ error: 'Invalid user' });
    }
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    
    res.json({ requests: vacationRequests });
  } catch (error) {
    console.error('Error validating admin access:', error);
    res.status(500).json({ error: 'Server error, please try again later' });
  }
});

// Start server
app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
}); 