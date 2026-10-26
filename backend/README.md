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


CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    number_of_rooms INTEGER NOT NULL,
    number_of_guests INTEGER NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT valid_booking_dates
        CHECK (check_in < check_out),

    CONSTRAINT valid_number_of_rooms
        CHECK (number_of_rooms > 0),

    CONSTRAINT valid_number_of_guests
        CHECK (number_of_guests > 0),

    CONSTRAINT valid_total_price
        CHECK (total_price >= 0),

    CONSTRAINT valid_booking_status
        CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);


CREATE TABLE booking_rooms (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    number_of_rooms INTEGER NOT NULL,
    price_per_night NUMERIC(10, 2) NOT NULL,

    CONSTRAINT fk_booking_rooms_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_booking_rooms_room
        FOREIGN KEY (room_id)
        REFERENCES rooms(id)
        ON DELETE RESTRICT,

    CONSTRAINT valid_booking_room_quantity
        CHECK (number_of_rooms > 0),

    CONSTRAINT valid_booking_room_price
        CHECK (price_per_night >= 0),

    CONSTRAINT unique_booking_room
        UNIQUE (booking_id, room_id)
);

CREATE TABLE favourites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accommodation_id INTEGER NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, accommodation_id)
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    accommodation_id INTEGER NOT NULL REFERENCES accommodations(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, accommodation_id)
);





{
    "name": "Havenly Ocean View",
    "description": "A comfortable hotel near the beach.",
    "address": "10 Marine Drive",
    "city": "Durban",
    "country": "South Africa",
    "star_rating": 4
}
  
  {
  "accommodation_id": 13,
  "room_type": " Room",
  "description": "A comfortable room with a balcony.",
  "bed_type": "Double",
  "capacity": 2,
  "price_per_night": 1200,
  "total_rooms": 6,
  "amenities": [
    "Wi-Fi",
    "Air conditioning",
    "TV",
    "Mini fridge",
    "Balcony"
  ]
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
 http://localhost:3000/api/auth/login
{
    "name" : "Sami",
    "email": "Sami@gmail.com",
    "password": "sami"
}


{
    "check_in": "2026-11-10",
    "check_out": "2026-11-13",
    "room_id": 1,
    "number_of_rooms": 1,
    "number_of_guests": 2
}
POsthttp://localhost:3000/api/bookings


status, Patch http://localhost:3000/api/bookings/1/status

GET	/api/users/me	Any logged-in user
PUT	/api/users/me	Any logged-in user
GET	/api/users	Admin only
GET	/api/users/1	Admin only
PUT	/api/users/1	Admin only
DELETE	/api/users/1	Admin only

GET	/api/reviews/:accommodation_id	View reviews
POST	/api/reviews/:accommodation_id	Add a review
PUT	/api/reviews/:accommodation_id	Update a review
DELETE	/api/reviews/:accommodation_id	Delete a review

GET	/api/favourites	Get logged-in user's favourites
POST	/api/favourites/:accommodation_id	Add a favourite
DELETE	/api/favourites/:accommodation_id	Remove a favourite


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



## how to calculate booking costs
  const price_per_night = Number(rows[0].price_per_night);

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const number_of_nights = Math.round(
        (checkOutDate.getTime() - checkInDate.getTime()) /
        millisecondsPerDay
    )
    return price_per_night * number_of_rooms * number_of_nights;

    1 second = 1,000 milliseconds
    1 minute = 60 seconds
    1 hour = 60 minutes
    1 day = 24 hours


## Why do I need a database transaction

//Suppose the first operation succeeds, but the second one fails because of a database error.
- The bookings table contains a booking.
- The booking_rooms table contains no rooms for that booking.
- Havenly now has an incomplete booking record.

// Its eisther we commit or we rollback

Begin, commit, rollback


## Why do I check availability again
 // to avoid concurrency so we are gonna use concurrent control
 for my app im goona use the -
 #### transaction and row-level locking
 //Customer A and Customer B request the same room dates.
The backend starts a transaction and locks the relevant room record using SELECT ... FOR UPDATE.
Customer A checks availability and saves the booking while holding the lock.
Customer A commits the transaction, releasing the lock.
Customer B can then proceed and check the updated availability. If there aren't enough rooms left, Customer B's booking is rejected.

### export const getClient = () => pool.connect();
Get a database connection that you can use for several related queries as one transaction.

Technique	Purpose
Database transaction	Makes related database changes succeed or fail together.
Availability check	Determines whether enough rooms are available for the requested dates.
Concurrency control	Prevents simultaneous requests from using the same remaining availability.