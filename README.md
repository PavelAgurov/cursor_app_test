# Employee Portal Application

A full-stack application with React frontend and Node.js backend using TypeScript, featuring an AI-powered chat bot and administrative functions.

## Architecture

For a detailed view of the application's architecture, please see the [architecture diagram](docs/architecture.md).

## Project Structure

```
├── client/               # React TypeScript frontend
│   ├── public/           # Static files
│   ├── src/              # Source files
│   │   ├── components/   # React components
│   │   │   ├── ChatBot.tsx         # AI-powered chat interface
│   │   │   ├── Login.tsx           # User authentication
│   │   │   └── VacationRequests.tsx # Vacation management (admin)
│   │   ├── lib/          # Utility functions
│   │   ├── App.tsx       # Main App component
│   │   ├── index.tsx     # Entry point
│   │   └── styles.css    # Application styles
│   ├── package.json      # Frontend dependencies
│   └── tsconfig.json     # TypeScript configuration
│
├── backend/              # Node.js TypeScript backend
│   ├── data/             # Data files
│   │   ├── users.yaml              # User accounts
│   │   ├── vacation-requests.yaml  # Vacation request data
│   │   ├── hr_general_data.csv     # HR policy information
│   │   ├── vacation-days.csv       # Vacation allotment data
│   │   └── chat_messages_examples.txt # Example chat interactions
│   ├── src/              # Source files
│   │   ├── services/     # Backend services
│   │   │   ├── dataService.ts      # Data management service
│   │   │   ├── llmService.ts       # OpenAI LLM integration
│   │   │   ├── prompt/             # LLM prompt templates
│   │   │   └── tools/              # LLM tool implementations
│   │   │       ├── hrPolicyTool.ts       # HR policy lookup
│   │   │       ├── personalInfoTool.ts   # User information retrieval
│   │   │       └── vacationRequestTool.ts # Vacation management
│   │   └── server.ts     # Express server
│   ├── package.json      # Backend dependencies
│   └── tsconfig.json     # TypeScript configuration
│
└── docs/                 # Documentation
    └── architecture.md   # Architecture diagram and explanation
```

## Getting Started

### Installing Dependencies

You can use the provided script to install dependencies for both frontend and backend:

```bash
./install-dependencies.bat
```

Or install them separately:

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

### Configuration

1. Backend configuration:
   - Copy `backend/env-template` to `backend/.env`
   - Update the values in `.env` with your OpenAI API key and other settings

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

- **React frontend** with TypeScript and modern UI
- **Node.js/Express backend** with full TypeScript integration
- **User authentication** with role-based permissions
- **AI-powered chat bot** using OpenAI integration
- **HR policy lookups** via LLM with RAG capabilities
- **Vacation request management** (admin only)
- **Auto-scroll** functionality in chat component
- **Responsive UI** design with modern styling

## Authentication

The application supports different user roles:
- **Regular users**: Can access the chat bot for HR inquiries
- **Admin users**: Have additional access to vacation requests management

Valid users are defined in `backend/data/users.yaml`.

## AI Chat Bot

The application includes an AI-powered chat bot that:
- Answers HR policy questions using RAG (Retrieval Augmented Generation)
- Provides personal information to authenticated users
- Processes vacation requests
- Uses LangChain and OpenAI to power interactions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 