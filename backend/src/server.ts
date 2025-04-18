import express, { Request, Response } from 'express';
import cors from 'cors';
import { getUsers, getVacationRequests, getChatResponses } from './services/dataService';

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000');

// Load data from YAML files
let validUsers: string[];
let vacationRequests: any[];
let chatResponses: { [key: string]: string };

// Initialize data
try {
  validUsers = getUsers();
  vacationRequests = getVacationRequests();
  chatResponses = getChatResponses();
  
  console.log('Data loaded successfully from YAML files');
} catch (error) {
  console.error('Error loading data:', error);
  validUsers = ['admin']; // Fallback to at least have admin access
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
  
  if (validUsers.includes(username.toLowerCase())) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Username does not exist' });
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
  res.json({ requests: vacationRequests });
});

// Start server
app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Valid users: ${validUsers.join(', ')}`);
}); 