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
    ├── data/           # YAML data files
    │   ├── users.yaml             # Valid user accounts
    │   ├── vacation-requests.yaml # Vacation request data
    │   └── chat-responses.yaml    # Chat bot responses
    ├── src/            # Source files
    │   ├── services/   # Data services
    │   │   └── dataService.ts     # Service to read YAML data
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
- Chat Bot with message history
- Vacation Requests management (admin only)
- Data stored in YAML files for easy maintenance
- Full TypeScript integration with proper types

## Valid Usernames

The application has a simple authentication system that accepts usernames defined in `backend/data/users.yaml`:
- john
- alice
- bob
- admin (has access to vacation requests) 