
# Expense Symphony Keeper

## Project Structure
The application is divided into two main modules:
- Frontend: React application with TypeScript and Vite
- Backend: Node.js API with Express and PostgreSQL

## Traditional Setup

### Backend Setup
```sh
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the backend server
npm start
```

### Frontend Setup
```sh
# In the project root directory
npm install

# Start the development server
npm run dev
```

## Docker Setup

You can easily run the entire application stack using Docker Compose:

```sh
# Build and start all containers
docker-compose up -d

# Stop all containers
docker-compose down

# Rebuild containers after making changes
docker-compose up -d --build
```

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001/api

## Development Notes

### Environment Variables
- Frontend: `.env`, `.env.production` 
- Backend: `backend/.env`

### Database
PostgreSQL database is initialized with the schema from `database.sql`.
Persistent data is stored in a Docker volume `postgres-data`.

## Accessing the App
Open your browser and navigate to `http://localhost:8080`

