import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT: number = parseInt(process.env.PORT || '5000');

// Valid usernames
const validUsers: string[] = ['john', 'alice', 'bob'];

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/hello', (req: Request, res: Response): void => {
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

// Start server
app.listen(PORT, (): void => {
  console.log(`Server running on port ${PORT}`);
}); 