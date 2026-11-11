# Task Manager (MERN): Pagination, Filtering, Searching, Sorting

## Setup
1. Start MongoDB locally.
2. Start the server:
   ```powershell
   cd server
   npm install
   npm run dev
   ```
3. Start the client in a new terminal:
   ```powershell
   cd client
   npm install
   npm run dev
   ```
4. Open the Vite URL (usually http://localhost:5173).

## Backend structure
- `server.js`: loads environment variables and starts the server.
- `app.js`: configures Express middleware and mounts routes.
- `config/db.js`: connects to MongoDB.
- `routes/`: API route definitions.
- `controllers/`: request handlers.
- `models/`: Mongoose models.

The server expects existing task records in the configured MongoDB database. The sample-data seed script has been removed.

## API
GET /api/tasks?search=api&status=doing&priority=high&sortBy=dueDate&order=asc&page=1&limit=10
