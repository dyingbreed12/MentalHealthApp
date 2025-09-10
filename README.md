# Mental Health Check-in Platform

This is a full-stack mini-application built for a practical exam. It allows employees to submit mental health check-ins and enables managers to review and track them.

## Key Features
- **Frontend:** Next.js (JavaScript)
- **Backend:** ASP.NET Core with Entity Framework Core (C#)
- **Database:** SQLite
- **Authentication:** In-memory user roles ("employee" vs. "manager")
- **Tests:** Vitest for the frontend, Xunit for the backend

## Setup and Running the Project

### 1. Prerequisites
- Node.js (version 18 or higher)
- .NET 6 SDK (or higher)

### 2. Set up the Backend
1. Navigate to the backend directory:

   `cd MentalHealthApp.Api`
3. Rebuild the solution and run the database migrations:

   `dotnet build`
   
   `dotnet ef database update`
4. Run the backend application:

    `dotnet run`

The API will run on `http://localhost:5062`.

### 3. Set up the Frontend
1. Navigate to the frontend directory:
   `cd mental-health-app`
2. Install the dependencies:
   `npm install`
3. Run the frontend application:
   `npm run dev`
The application will be available at `http://localhost:3000`.

### 4. Authentication
Use the following credentials to log in:
- **Employee:** `username: employee`, `password: password`
- **Manager:** `username: manager`, `password: password`

### 5. Testing
- **Run Backend Tests:**
  `cd MentalHealthApp.Api.Tests`
  `dotnet test`
- **Run Frontend Tests:**
  `cd mental-health-app`
  `npm test`
