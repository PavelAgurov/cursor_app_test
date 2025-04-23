# Employee Portal Requirements

## Data Management

### User Story: Strict Data-Driven User Management
**As a** system administrator,  
**I want to** have all user data read exclusively from configuration files with no hardcoded fallbacks,  
**So that** I have complete control over who can access the system.

#### Acceptance Criteria:
1. Valid usernames are read only from the backend users.yaml file
2. No hardcoded usernames exist anywhere in the codebase
3. If the backend is unavailable, the login page shows a clear error rather than using fallback users
4. The login page dynamically displays available usernames from the backend
5. Login button is disabled when no valid users are available
6. Changes to the users.yaml file are reflected without code modifications
7. Application includes helpful error messages when user data cannot be retrieved
8. API endpoint is available to fetch valid usernames without authentication
9. Documentation clearly states that user management is entirely data-driven

## Code Maintenance

### User Story: Code Cleanup
**As a** developer working on the Employee Portal,  
**I want to** remove any unused components and code,  
**So that** the codebase remains clean, maintainable, and efficient.

#### Acceptance Criteria:
1. All unused components are identified and removed
2. The HelloButton component has been removed as it's no longer needed
3. No dead code or unused imports remain in the codebase
4. Documentation is updated to reflect the current state of the application
5. Application functionality remains intact after cleanup

## User Authentication

### User Story: Secure Backend Login Validation
**As a** system administrator,  
**I want to** have all user validation performed on the backend,  
**So that** user data remains secure and not exposed to the frontend.

#### Acceptance Criteria:
1. No user data or valid usernames are ever exposed to the frontend
2. All username validation happens exclusively on the backend through a secure API endpoint
3. The login page never displays a list of valid users
4. Invalid login attempts receive generic error messages without indicating if a username exists
5. Login attempts are validated by a backend `/api/login` endpoint
6. Backend endpoint returns only success/failure status and minimal required user role information
7. User list management remains exclusively on the backend

### User Story: Simplified Login
**As a** portal user,  
**I want to** log in with only my username,  
**So that I** can quickly access the portal without the complexity of remembering passwords.

#### Acceptance Criteria:
1. Login page only requires a username field
2. The login form submits the username to a secure backend validation service
3. Admin users receive admin privileges upon successful login
4. Regular users receive standard user privileges upon successful login
5. Error messages are generic and do not reveal valid usernames
6. No password field is present on the login form

## Global Styling and User Experience

### User Story: Clean and Focused Interface
**As a** portal user,  
**I want to** have a clean interface without unnecessary headers,  
**So that I** can focus on the content and functionality.

#### Acceptance Criteria:
1. No global black header across the application
2. Each page has its own contextual header appropriate to its function
3. The login page clearly identifies the application as "Employee Portal"
4. All main sections (Dashboard, Chat Bot, Vacation Requests) share a consistent color scheme
5. Headers across all sections use the same yellow-orange color (#FFCE7D)
6. Interactive elements (buttons, links) use the same orange accent color (#FFAE7C)
7. Card components maintain the same visual styling and spacing patterns
8. Typography is consistent across all sections

## Dashboard Feature

### User Story: Dashboard Integration
**As a** portal user,  
**I want to** see the dashboard immediately after logging in,  
**So that I** can quickly access all the features I need without additional navigation.

#### Acceptance Criteria:
1. Dashboard appears as the main interface immediately after login
2. The dashboard displays a "My dashboard" title
3. User profile avatar is displayed in the top-right corner using a locally stored image
4. The dashboard is a seamless part of the main application

### User Story: Dashboard Cards
**As a** portal user,  
**I want to** see categorized feature cards on my dashboard that respond to my interactions,  
**So that I** can identify and access the features I need with clear visual feedback.

#### Acceptance Criteria:
1. Cards are displayed in a 2-column grid layout
2. Each card has:
   - A blue icon representing the feature
   - A title 
   - A short description
3. Cards have a light blue background (#EEF3FF)
4. Cards must include the following features:
   - Promotions
   - Raise a query
   - Policies
   - Benefits
   - Title (placeholder)
   - Vacation requests (for admin users only)
5. Cards provide visual feedback when:
   - Hovered: Slightly elevate with increased shadow
   - Focused: Show the same effect as hover for accessibility
   - Pressed: Show a more subtle elevation
6. Cards are keyboard navigable with proper focus states
7. Clicking on the Vacation requests card opens the Vacation requests screen

### User Story: User Identity Display
**As a** portal user,  
**I want to** see my user information and have logout access directly from the dashboard,  
**So that I** can identify my account and manage my session easily.

#### Acceptance Criteria:
1. User's name is displayed in a welcome message
2. User's role is displayed in parentheses
3. A logout button is readily accessible from the dashboard header
4. Avatars are displayed with fallback images when user images can't be loaded

### User Story: Chat Support Access
**As a** portal user,  
**I want to** easily access the chat support from the dashboard,  
**So that I** can get help when needed.

#### Acceptance Criteria:
1. A floating chat button is displayed in the bottom-right corner
2. The chat button has an orange background (#FFAE7C)
3. The chat button has a chat icon
4. Clicking the chat button will directly open the chat interface

### User Story: Dashboard Header
**As a** portal user,  
**I want to** have a clearly visible header on the dashboard,  
**So that I** can identify where I am in the application.

#### Acceptance Criteria:
1. The header has a yellow-orange background (#FFCE7D)
2. The header contains the dashboard title
3. The header spans the full width of the screen
4. The header has a subtle shadow to create visual hierarchy

### User Story: Dashboard Layout
**As a** user,  
**I want to** have a clean, stable dashboard layout that works on various devices,  
**So that I** can have a consistent experience regardless of my device.

#### Acceptance Criteria:
1. Dashboard layout is stable with no unwanted movement or trembling
2. Layout adjusts appropriately for smaller screens
3. Content is properly spaced and aligned
4. Interface is responsive down to mobile sizes

### User Story: Dashboard Accessibility
**As a** user with accessibility needs,  
**I want to** navigate the dashboard using keyboard or assistive technology,  
**So that I** can use the application regardless of my abilities.

#### Acceptance Criteria:
1. All interactive elements have appropriate ARIA attributes
2. Dashboard cards and buttons are keyboard navigable
3. Focus states are clearly visible
4. Images have appropriate alt text
5. Default avatar displays when profile images fail to load

## Chat Bot Feature

### User Story: Chat Interface
**As a** portal user,  
**I want to** interact with a friendly and visually appealing chat interface,  
**So that I** can easily communicate with the system.

#### Acceptance Criteria:
1. Chat interface has the same header style as the dashboard (#FFCE7D)
2. User messages have the chat button orange background (#FFAE7C)
3. Bot messages have the light blue card background (#EEF3FF)
4. Send button matches the chat button color (#FFAE7C)
5. Input field has consistent styling with orange focus states
6. Chat messages have smooth animation when appearing
7. Typing indicator uses the same accent color

### User Story: Chat Navigation
**As a** portal user,  
**I want to** easily navigate between the chat and dashboard,  
**So that I** can access different features without losing my context.

#### Acceptance Criteria:
1. Back button in the chat header returns to the dashboard
2. Chat button in the dashboard opens the chat interface
3. Chat expands to fill available space in the viewport
4. User's chat history is preserved during the session

## Vacation Requests Feature

### User Story: Vacation Request Management
**As an** admin user,  
**I want to** view and filter vacation requests in a visually consistent interface,  
**So that I** can efficiently manage employee time off.

#### Acceptance Criteria:
1. Vacation requests interface uses the same header style as dashboard (#FFCE7D)
2. Filter buttons have the same interactive styling as other controls
3. Active filters use the accent orange color (#FFAE7C)
4. Table header matches the header color scheme
5. Status badges have appropriate colors with hover effects
6. Table rows have subtle hover states for better visibility

### User Story: Vacation Request Navigation
**As an** admin user,  
**I want to** easily toggle between the vacation management and dashboard views,  
**So that I** can efficiently perform different tasks.

#### Acceptance Criteria:
1. Back button in the vacation header returns to the dashboard
2. Vacation requests expand to fill available space in the viewport
3. Admin can access vacation requests directly from a dashboard card
4. Interface adapts to different screen sizes 