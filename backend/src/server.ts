import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000');

// Valid usernames
const validUsers: string[] = ['john', 'alice', 'bob', 'admin'];

// Sample vacation requests data
const vacationRequests = [
  {
    id: 1,
    employeeName: 'John Doe',
    startDate: '2023-06-15',
    endDate: '2023-06-22',
    status: 'approved'
  },
  {
    id: 2,
    employeeName: 'Alice Smith',
    startDate: '2023-07-10',
    endDate: '2023-07-15',
    status: 'pending'
  },
  {
    id: 3,
    employeeName: 'Bob Johnson',
    startDate: '2023-08-01',
    endDate: '2023-08-14',
    status: 'rejected'
  },
  {
    id: 4,
    employeeName: 'Sarah Williams',
    startDate: '2023-09-05',
    endDate: '2023-09-10',
    status: 'pending'
  }
];

// Simple chat bot responses
const chatResponses: { [key: string]: string } = {
  'hello': 'Hello! How can I assist you today?',
  'hi': 'Hi there! How can I help you?',
  'how are you': 'I\'m doing well, thank you for asking! How can I assist you?',
  'help': 'I can help you with information about the company, vacation requests, or general inquiries. What would you like to know?',
  'vacation': 'To request vacation time, please submit your request through the vacation request form. Admin users can view all vacation requests.',
  'bye': 'Goodbye! Have a great day!',
  'thank you': 'You\'re welcome! Is there anything else I can help you with?',
  'thanks': 'You\'re welcome! Is there anything else I can help you with?'
};

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
}); 