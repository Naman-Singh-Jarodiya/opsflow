OpsFlow

Internal Operations & Work Management Platform

OpsFlow is a full-stack web application that helps teams manage their daily operational work from one place.

The idea behind OpsFlow is pretty simple. In many teams, work gets managed through chats, spreadsheets, emails, and personal messages, which can make it difficult to know what needs to be done, who is responsible for it, and what has already happened. OpsFlow brings this work into one system where teams can create work items, assign them to people, track their progress, and keep a proper history of changes.

While building the application, I also focused on some problems that normally appear in real-world systems, such as two users updating the same work item, unauthorized access, invalid status changes, duplicate requests, and handling a large number of work items.

Features

Work Items

Users can create and manage work items, add descriptions, set priorities, assign them to team members, add due dates, update their status, and search or filter through existing work.

Each work item also keeps track of useful information such as who created it, which team it belongs to, who is responsible for it, and what changes have been made over time.

Work Status

Work items follow a defined workflow:

OPEN → IN_PROGRESS → BLOCKED → RESOLVED → CLOSED

The backend checks every status change before applying it. This prevents users from making workflow changes that are not allowed.

Teams and Roles

OpsFlow supports multiple teams and users.

A user can belong to one or more teams, and access depends on their role and team membership.

The current roles are ADMIN, MANAGER, and MEMBER.

Permissions are checked on the backend. So even if someone tries to directly call an API or change a resource ID, the server still verifies whether that user actually has access.

Handling Multiple Users

Since this is an internal tool, multiple people may work on the same item at the same time.

For example, one user may open a work item while another user updates it. If the first user then tries to save an older version, OpsFlow detects that the data is no longer current instead of silently overwriting the newer changes.

This is handled using optimistic concurrency control with a version number on every work item.

Activity History

Important changes made to a work item are recorded in its activity history.

For example, the system can record when an item was created, assigned, updated, when its priority or status changed, and when it was deleted.

This makes it easier to understand what happened to a work item and provides a useful record of important actions.

Safe Deletion

Work items are soft-deleted instead of being permanently removed immediately.

The system keeps information about when an item was deleted and who deleted it, while removing it from the normal active work-item lists.

This helps preserve useful operational history.

Preventing Duplicate Requests

OpsFlow also supports idempotency for important operations.

This is useful when the same request is sent more than once because of network retries, accidental double clicks, or other client-side issues.

The goal is to make sure that repeating the same operation does not unnecessarily create duplicate effects.

Tech Stack

Frontend:
React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, React Hook Form, Zod, and Lucide Icons.

Backend:
Node.js, TypeScript, Express.js, Prisma, PostgreSQL, JWT, bcrypt, and Zod.

Testing:
Vitest and Supertest.

How the Application Works

The application follows a simple flow:

User → React Frontend → Express API → Authentication & Authorization → Business Logic → Prisma → PostgreSQL

The frontend handles the user interface and communicates with the backend through REST APIs.

The backend takes care of authentication, authorization, validation, workflow rules, concurrency checks, and database operations.

PostgreSQL is used to store the application's data.

Project Structure

The project is split into two main applications: frontend and backend.

The frontend contains the React pages, components, layouts, context, and API-related code.

The backend contains the Express server, routes, controllers, middleware, services, Prisma setup, and utilities.

The repository also contains documentation such as README.md and ENGINEERING_DECISIONS.md.

Main Pages

The application currently includes:

Login
Dashboard
My Work
Work Items
Create Work Item
Work Item Details
Teams
Settings

The Dashboard provides a quick overview of the current work.

The Work Items page allows users to search, filter, and paginate through work items instead of loading everything into the browser at once.

The Work Item Details page provides the complete information about an individual item along with its activity history.

API

The backend provides REST APIs for authentication, dashboard data, teams, and work items.

Some of the main endpoints are:

POST /api/auth/login
POST /api/auth/register
GET /api/auth/me

GET /api/dashboard

GET /api/teams
POST /api/teams
GET /api/teams/:id

GET /api/work-items
POST /api/work-items
GET /api/work-items/:id
PATCH /api/work-items/:id
DELETE /api/work-items/:id

POST /api/work-items/:id/assign
POST /api/work-items/:id/status
POST /api/work-items/:id/comments
GET /api/work-items/:id/activity

Authentication and Security

Users authenticate using JWT-based authentication.

Passwords are hashed using bcrypt rather than being stored as plain text.

Protected API routes verify the authenticated user before allowing access.

The backend also performs resource-level authorization, so a user cannot simply change an ID in the URL and access another team's work.

Input received by the API is validated using Zod.

Sensitive values such as database credentials and JWT secrets are kept in environment variables.

Database

The main database entities are:

User
Team
TeamMembership
WorkItem
Comment
Activity
IdempotencyKey

A work item stores information such as its title, description, status, priority, team, assignee, creator, due date, version, and timestamps.

Activity history and deletion information are also stored where required.

Search, Filtering and Pagination

The Work Items page supports searching and filtering by information such as status, priority, team, and assignee.

The API also uses pagination.

This becomes important as the number of work items grows. Instead of sending the complete dataset to the browser, the server returns only the records needed for the current page.

Error Handling

The backend uses standard HTTP status codes to make errors clear.

400 means the request is invalid.

401 means authentication is required or invalid.

403 means the user does not have permission to perform the requested action.

404 means the requested resource could not be found.

409 is used for conflicts, such as trying to update an outdated version of a work item.

Testing

The project includes automated backend tests for the behaviours that are most important in a multi-user system.

The tests currently cover:

Rejecting updates when the work item version is outdated.

Rejecting unauthorized access.

Rejecting invalid workflow transitions.

Soft deleting a work item.

Recording deletion activity.

The idea is to test the areas where a bug could have a bigger impact instead of focusing only on basic CRUD operations.

Running the Project Locally

Requirements:

Node.js
npm
PostgreSQL

First, create a PostgreSQL database named:

opsflow

Then create a backend/.env file with your database connection, port, and JWT secret.

Example:

DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/opsflow"
PORT=4000
JWT_SECRET="your-secret-key"

The actual .env file should not be committed to GitHub.

Backend Setup

Go to the backend directory and install the dependencies.

Run the Prisma migrations and generate the Prisma client.

Then start the backend using the development command.

The backend runs on:

http://localhost:4000

The API health check is available at:

http://localhost:4000/api/health

Frontend Setup

Open another terminal, go to the frontend directory, install the dependencies, and start the development server.

The frontend runs on:

http://localhost:5173

Build

The frontend can be built using the production build command.

The backend can also be compiled using its build command.

Testing

Backend tests can be run from the backend directory using the test command.

Engineering Decisions

The important technical decisions made during development are documented separately in ENGINEERING_DECISIONS.md.

The document covers the application architecture, database design, optimistic concurrency, server-side authorization, activity history, and soft deletion, along with the reasoning behind these choices.

Performance

OpsFlow is designed to handle a growing amount of work.

The application does not load all work items into the browser. Filtering and pagination are handled on the server, and only the data needed by the current view is returned.

This keeps API responses smaller and makes the application more suitable for larger datasets.

Deployment

The application can be deployed using a setup such as:

Frontend → Vercel
Backend → Render
Database → Managed PostgreSQL

For production, the required environment variables should be configured on the hosting platforms, a secure JWT secret should be used, and CORS should be restricted to the deployed frontend domain.

Known Limitations

The current version focuses on the main requirements of the operations management system.

Some features that could be added later include real-time updates, email or Slack notifications, background job processing, more advanced search, more detailed analytics, finer-grained permissions, a notification center, and production monitoring.

These features were kept outside the current scope so that the core workflow and reliability requirements could be completed properly.

Future Scope

With more development time, OpsFlow could be extended with real-time collaboration, automated workflows, notifications, advanced reporting, third-party integrations, background workers, improved analytics, audit reports, and better monitoring.

Why OpsFlow?

The main goal of OpsFlow is to make operational work easier to manage and easier to understand.

Instead of depending on scattered chats, spreadsheets, and emails, a team can use one system to see what needs to be done, why it needs to be done, who is responsible, what the current status is, how important it is, and what has happened so far.

The project was built with the idea that an internal operations tool should not only work in the normal case, but should also behave predictably when multiple users are working at the same time.

License

This project was created as part of a Software Engineering assessment.
