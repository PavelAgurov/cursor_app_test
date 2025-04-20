# Application Architecture

Below is a diagram representing the architecture of our Employee Portal application:

```mermaid
graph TD
    %% Client Side
    subgraph Frontend["Frontend (React)"]
        App["App Component"]
        App --> Login["Login Component"]
        App --> ChatBot["ChatBot Component"]
        App --> VacationRequests["VacationRequests Component"]
        
        %% Libraries and Services
        ReactLibs["React Libraries"]
        App --> ReactLibs
        Axios["Axios API Client"]
    end
    
    %% Backend Side
    subgraph Backend["Backend (Node.js/Express)"]
        Server["Express Server"]
        
        %% Services
        subgraph Services["Services"]
            LLMService["LLM Service"]
            DataService["Data Service"]
        end
        
        %% Tools
        subgraph Tools["LLM Tools"]
            HRPolicyTool["HR Policy Tool"]
            PersonalInfoTool["Personal Info Tool"]
            VacationRequestTool["Vacation Request Tool"]
        end
        
        %% Data Storage
        subgraph Data["Data Files"]
            UsersYAML["users.yaml"]
            VacationYAML["vacation-requests.yaml"] 
            HRData["hr_general_data.csv"]
        end
        
        %% Relations between backend components
        Server --> Services
        LLMService --> Tools
        DataService --> Data
        Tools --> DataService
    end
    
    %% API Routes
    subgraph API["REST API Endpoints"]
        Login_API["/api/login"]
        Chat_API["/api/chat"]
        VacationRequests_API["/api/vacation-requests"]
        Users_API["/api/users"]
    end
    
    %% External Services
    subgraph External["External Services"]
        OpenAI["OpenAI API"]
    end
    
    %% Connect Frontend to API
    Axios --> API
    
    %% Connect API to Backend
    API --> Server
    
    %% Connect to External Services
    LLMService --> OpenAI
    
    %% Styling
    classDef frontendNode fill:#f9d6ff,stroke:#333,stroke-width:1px;
    classDef backendNode fill:#d0e0ff,stroke:#333,stroke-width:1px;
    classDef apiNode fill:#ffffb5,stroke:#333,stroke-width:1px;
    classDef dataNode fill:#e0f5e0,stroke:#333,stroke-width:1px;
    classDef externalNode fill:#ffd2cc,stroke:#333,stroke-width:1px;
    
    class Frontend,App,Login,ChatBot,VacationRequests,ReactLibs,Axios frontendNode;
    class Backend,Server,Services,LLMService,DataService,Tools,HRPolicyTool,PersonalInfoTool,VacationRequestTool backendNode;
    class API,Login_API,Chat_API,VacationRequests_API,Users_API apiNode;
    class Data,UsersYAML,VacationYAML,HRData dataNode;
    class External,OpenAI externalNode;
```

## Architecture Overview

This application follows a client-server architecture with:

### Frontend
- React-based single-page application
- Component-based structure for different features (Login, ChatBot, VacationRequests)
- Axios for API requests to the backend

### Backend
- Express.js server
- Services:
  - LLM Service: Handles AI interactions using OpenAI
  - Data Service: Manages data operations
- Tools:
  - HR Policy Tool: Retrieves HR policy information
  - Personal Info Tool: Manages user information
  - Vacation Request Tool: Processes vacation requests

### Data Storage
- File-based storage using YAML and CSV files

### External Services
- OpenAI API for chat bot functionality

### API Endpoints
- `/api/login`: User authentication
- `/api/chat`: Chat bot interactions
- `/api/vacation-requests`: Vacation request management (admin only)
- `/api/users`: User management (admin only)

## Data Flow

1. Users interact with the frontend React components
2. Requests are sent via Axios to the Express backend API endpoints
3. The backend processes requests using appropriate services
4. For chat functionality, the LLM service communicates with OpenAI
5. Data is stored and retrieved from YAML and CSV files
6. Responses are returned to the frontend for display to the user 