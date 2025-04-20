# Use Cases

This document outlines the primary use cases for the Employee Portal application, organized by user role.

## User Roles

The application supports two primary roles:
1. **Regular User** - Standard employee access
2. **Admin User** - Administrative privileges for managing vacation requests and users

## Authentication Use Cases

### UC-1: User Login

**Actor**: Any User (Regular or Admin)
**Description**: User authenticates to access the Employee Portal.
**Flow**:
1. User navigates to the application login page
2. User enters their username
3. System validates the username against the users database
4. System grants access and assigns the appropriate role
5. User is redirected to the main portal page

### UC-2: User Logout

**Actor**: Authenticated User (Regular or Admin)
**Description**: User logs out of the Employee Portal.
**Flow**:
1. User clicks the "Logout" button
2. System clears user session data
3. User is redirected to the login page

## Chat Bot Use Cases

### UC-3: HR Policy Inquiry

**Actor**: Authenticated User (Regular or Admin)
**Description**: User queries the chat bot about HR policies.
**Flow**:
1. User selects the "Chat Bot" option
2. User types a question about HR policies (e.g., "What is the vacation policy?")
3. System processes the query using the HR Policy Tool
4. System retrieves relevant information from HR policy data
5. Chat bot returns a response with the requested information

### UC-4: Personal Information Inquiry

**Actor**: Authenticated User (Regular or Admin)
**Description**: User requests personal information through the chat bot.
**Flow**:
1. User selects the "Chat Bot" option
2. User types a request for personal information (e.g., "How many vacation days do I have?")
3. System processes the query using the Personal Info Tool
4. System verifies permissions:
   - Regular users can only access their own personal information
   - Admin users can access information for any user by specifying the username
5. System retrieves the appropriate user's personal information based on permissions
6. Chat bot returns the requested personal information

**Permissions**:
- Regular users: Can only query their own personal information
- Admin users: Can query personal information for any user in the system by specifying the target user's name (e.g., "How many vacation days does John have?")

### UC-5: Vacation Request Submission

**Actor**: Authenticated User (Regular or Admin)
**Description**: User submits a vacation request through the chat bot.
**Flow**:
1. User selects the "Chat Bot" option
2. User requests to submit a vacation request (e.g., "I want to take vacation from July 1 to July 5")
3. System processes the request using the Vacation Request Tool
4. System verifies permissions:
   - Regular users can only submit vacation requests for themselves
   - Admin users can submit vacation requests on behalf of any user by specifying the username
5. System validates and records the vacation request for the appropriate user
6. Chat bot confirms the request has been submitted successfully

**Permissions**:
- Regular users: Can only submit vacation requests for themselves
- Admin users: Can submit vacation requests for any user by specifying the target user (e.g., "Book vacation for Alice from August 10 to August 15")

## Vacation Management Use Cases

### UC-6: View Vacation Requests

**Actor**: Admin User
**Description**: Admin views all employee vacation requests.
**Flow**:
1. Admin selects the "Vacation Requests" option
2. System retrieves vacation request data
3. System displays the list of all vacation requests in a table with scrollable interface
4. Admin can view details including employee name, dates, and status

### UC-7: Filtering Vacation Requests

**Actor**: Admin User
**Description**: Admin filters vacation requests by status.
**Flow**:
1. Admin navigates to the "Vacation Requests" page
2. Admin views requests arranged in a table
3. Admin can scroll through the list to view all requests
4. Each request displays with its status (pending, approved, rejected) clearly indicated

## User Experience Use Cases

### UC-8: Auto-scroll in Chat

**Actor**: Authenticated User (Regular or Admin)
**Description**: System automatically scrolls the chat window to show the latest messages.
**Flow**:
1. User is engaged in a chat conversation
2. When new messages are added (user input or bot response)
3. System automatically scrolls to the bottom of the chat to show the latest message
4. After sending a message, focus is returned to the input field for continued conversation

### UC-9: View Application Actions

**Actor**: Authenticated User (Regular or Admin)
**Description**: User views available actions in the portal.
**Flow**:
1. After login, user is presented with the main portal page
2. User sees available action cards based on their role (Chat Bot for all, Vacation Requests for admins)
3. User can select an action to proceed with that functionality

