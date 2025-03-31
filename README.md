
# Expense Symphony Keeper

## Project Structure
The application is divided into two main modules:
- Frontend: React application with TypeScript and Vite
- Backend: Node.js API with Express and PostgreSQL

## Setup Options

### Option 1: Docker Setup (Recommended)

#### Prerequisites
- Docker and Docker Compose installed on your machine
- Git installed

#### Step 1: Clone the Repository
```sh
# Clone the repository from your Git provider
git clone <your-repository-url>

# Navigate to the project directory
cd <project-directory>
```

#### Step 2: Create Docker Network
```sh
# Create a network for the containers to communicate
docker network create expense-app-network
```

#### Step 3: Build and Start the Containers
```sh
# Build and start all services defined in docker-compose.yml
docker-compose up -d

# To rebuild containers after making changes
docker-compose up -d --build
```

#### Step 4: Access the Application
Open your browser and navigate to:
```
http://localhost:8080
```

#### Step 5: Stop the Containers
When you're done using the application:
```sh
# Stop all running containers
docker-compose down
```

#### Additional Docker Commands
```sh
# View logs from all containers
docker-compose logs

# View logs from a specific container
docker-compose logs frontend
docker-compose logs backend
docker-compose logs postgres

# Check the status of your containers
docker-compose ps

# Remove all containers, networks, and volumes
docker-compose down -v
```

### Option 2: Traditional Setup

#### Prerequisites
- Node.js (v18+) installed
- PostgreSQL installed and running
- Git installed

#### Step 1: Clone and Setup Backend
```sh
# Clone the repository
git clone <your-repository-url>

# Navigate to the project directory
cd <project-directory>

# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Configure environment variables
# Create a .env file based on the example in backend/.env
```

#### Step 2: Setup Database
```sh
# Create PostgreSQL database
createdb expense_tracker

# Import the schema (from project root)
psql -U postgres -d expense_tracker -f database.sql
```

#### Step 3: Start the Backend Server
```sh
# From the backend directory
npm start

# The backend API will be available at http://localhost:3001/api
```

#### Step 4: Setup and Start Frontend
```sh
# In a new terminal, navigate to the project root directory
cd <project-directory>

# Install frontend dependencies
npm install

# Create a .env file for frontend environment variables
# Set VITE_API_URL=http://localhost:3001/api

# Start the development server
npm run dev

# The frontend will be available at http://localhost:5173
```

## Using the Application

### Creating an Account
1. Navigate to the registration page by clicking "Register" on the home page
2. Enter your desired username, email, and password
3. Click "Register" to create your account

### Adding Categories
1. From the dashboard, go to the Categories section
2. Click "Add Category"
3. Enter a category name and select a color
4. Click "Add Category" to save

### Adding Expenses
1. From the dashboard, click "Add Expense"
2. Enter the expense amount, description, date, and select a category
3. Click "Add Expense" to save

### Viewing Reports
1. Navigate to the dashboard to see your spending charts
2. View expenses by month or by category
3. Use the filtering options to analyze expenses from different time periods

## Development Notes

### Environment Variables
- Frontend: `.env`, `.env.production` 
- Backend: `backend/.env`

### Database
PostgreSQL database is initialized with the schema from `database.sql`.
Persistent data is stored in a Docker volume `postgres-data`.

## Troubleshooting

### Docker Issues
- **Container not starting**: Check logs with `docker-compose logs <service-name>`
- **Database connection failures**: Ensure the postgres container is running and healthy
- **Network issues**: Verify the Docker network exists with `docker network ls`

### Database Issues
- **Migration errors**: Check that the database schema matches what's expected in `database.sql`
- **Connection errors**: Verify database credentials in environment variables

### API Connection Issues
- **Frontend can't connect to backend**: Check the VITE_API_URL environment variable
- **CORS errors**: Ensure the backend is configured to accept requests from the frontend origin

### Authentication Issues
- **Login failures**: Verify that the JWT_SECRET is consistent
- **Token expiration**: Check for expired tokens or session timeouts
