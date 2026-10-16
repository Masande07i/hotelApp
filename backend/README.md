CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_image TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'customer'
        CHECK (role IN ('customer', 'admin')),
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




CREATE TABLE IF NOT EXISTS accommodations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    star_rating INT CHECK (star_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accommodation_images (
    id SERIAL PRIMARY KEY,
    accommodation_id INT NOT NULL
        REFERENCES accommodations(id)
        ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    public_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    accommodation_id INTEGER NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
    room_type VARCHAR(100) NOT NULL,
    description TEXT,
    bed_type VARCHAR(100),
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    price_per_night NUMERIC(10, 2) NOT NULL CHECK (price_per_night >= 0),
    total_rooms INTEGER NOT NULL DEFAULT 1 CHECK (total_rooms > 0),
    amenities TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




{
    "name": "Havenly Ocean View",
    "description": "A comfortable hotel near the beach.",
    "address": "10 Marine Drive",
    "city": "Durban",
    "country": "South Africa",
    "star_rating": 4
}
  
Create	POST /api/auth/register	Already implemented
Read all	GET /api/users	Retrieve users
Read one	GET /api/users/:id	Retrieve one user
Update	PUT /api/users/:id	Update user details

{
    "name" : "mine",
    "email": "mine@gmail.com",
    "password": "123"
}

{
    "name" : "Sami",
    "email": "Sami@gmail.com",
    "password": "sami"
}

GET	/api/users/me	Any logged-in user
PUT	/api/users/me	Any logged-in user
GET	/api/users	Admin only
GET	/api/users/1	Admin only
PUT	/api/users/1	Admin only
DELETE	/api/users/1	Admin only


Frontend page	API endpoint	Purpose
Profile page	GET /api/users/me	Display the user's details
Edit profile	PUT /api/users/me	Save profile changes
Admin dashboard	GET /api/users	Display all users
Admin user management	PUT /api/users/:id	Update a selected user
Admin user management	DELETE /api/users/:id	Delete a selected user


### this is the reason whyb i used the middleware to check user roles , and what each file does 
protect — verifies that the user is logged in.
adminOnly — allows only admins to manage accommodations and other users.
Controllers — validate request data and handle the requested action.
Services — execute database queries.
Ownership checks — ensure customers can access only their own private information, such as their profile and bookings.
## Admin

Sami@gmail.com
Sami
password: sami


## CORS
npm install cors
npm install -D @types/cors
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testDbConnection } from './config/database';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import accommodationRoutes from './routes/accommodationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accommodations', accommodationRoutes);

const startServer = async () => {
  await testDbConnection();

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};

startServer();
