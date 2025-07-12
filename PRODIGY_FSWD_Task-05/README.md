# MERN Stack Authentication System

A full-stack authentication system built with the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring user registration, login, and role-based access control.

## Features

- User registration and login
- Secure password hashing with bcrypt
- JWT-based authentication
- Protected routes
- Role-based access control (User/Admin)
- Responsive UI with Material-UI
- Form validation
- Persistent login sessions

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   PORT=5000
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will open in your default browser at `http://localhost:3000`

## Project Structure

```
mern-auth/
├── backend/               # Backend server
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   └── server.js          # Main server file
├── frontend/              # Frontend React app
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── components/    # Reusable components
│       ├── contexts/      # React contexts
│       ├── pages/         # Page components
│       ├── services/      # API services
│       ├── App.js         # Main App component
│       └── index.js       # Entry point
└── README.md              # Project documentation
```

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### User Routes (Protected)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Environment Variables

### Backend
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRE` - JWT expiration time
- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port (default: 5000)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- dotenv for environment variables

### Frontend
- React.js
- React Router for routing
- Material-UI for UI components
- Formik and Yup for form handling and validation
- Axios for HTTP requests
- Context API for state management

## License

This project is licensed under the MIT License.
