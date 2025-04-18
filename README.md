# TypeScript Full Stack Application

A simple full-stack application with React frontend and Node.js backend, both using TypeScript.

## Project Structure

```
├── client/             # React TypeScript frontend
│   ├── public/         # Static files
│   ├── src/            # Source files
│   │   ├── components/ # React components
│   │   │   ├── HelloButton.tsx  # Button to call backend API
│   │   │   └── Login.tsx        # Login component
│   │   ├── App.tsx     # Main App component
│   │   ├── index.tsx   # Entry point
│   │   └── styles.css  # Application styles
│   ├── package.json    # Frontend dependencies
│   └── tsconfig.json   # TypeScript configuration
│
└── backend/            # Node.js TypeScript backend
    ├── src/            # Source files
    │   └── server.ts   # Express server
    ├── package.json    # Backend dependencies
    └── tsconfig.json   # TypeScript configuration
```

## Getting Started

### Installing Dependencies

1. Install backend dependencies:
```bash
cd backend
npm install
```

2. Install frontend dependencies:
```bash
cd client
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd client
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## Features

- React frontend with TypeScript
- Node.js backend with Express and TypeScript
- User authentication with username validation
- Protected Hello page that requires login
- "Hello" button that calls the backend API
- Full TypeScript integration with proper types

## Valid Usernames

The application has a simple authentication system that accepts the following usernames:
- john
- alice
- bob 