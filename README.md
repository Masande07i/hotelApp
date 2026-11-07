# hotelApp

# project image
<img src="https://socialify.git.ci/Masande07i/hotelApp/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="hotelApp" width="640" height="320" />

# Havenly 

Havenly is a full-stack hotel booking web application built with React, TypeScript, Node.js, Express, and Neon PostgreSQL.

The application allows customers to browse accommodations, view rooms, make bookings, save favourites, leave reviews, and make payments.

Admins can manage accommodations, rooms, images, customers, and bookings.

---

##  Features

### Customer

- Register and log in
- Google login
- Browse accommodations
- Search accommodations
- View accommodation details
- View rooms and prices
- View hotel images
- View hotel location on a map
- Add and remove favourites
- Make bookings
- View bookings
- Cancel bookings
- Make payments with Paystack
- Leave reviews after a completed booking
- Manage profile

### Admin

- Admin dashboard
- Create, update and delete accommodations
- Upload and delete accommodation images
- Create, update and delete rooms
- View customers
- Manage bookings
- Update booking status

---

##  Technologies

### Frontend

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- CSS Modules
- React Icons
- Leaflet
- React Leaflet

### Backend

- Node.js
- Express
- TypeScript
- JWT
- bcrypt
- Google OAuth
- Multer

### Database & Services

- Neon PostgreSQL
- Cloudinary
- Paystack

---

##  Project Structure

```text
hotelApp/
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── features/
│       ├── pages/
│       ├── store/
│       └── main.tsx
│
├── backend/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── server.ts
│
├── README.md
└── .gitignore
```

---

##  Database

Havenly uses **Neon PostgreSQL** as its database.

Main tables include:

```text
users
accommodations
accommodation_images
rooms
bookings
booking_rooms
favourites
reviews
payments
```

The database stores information about users, hotels, rooms, bookings, reviews, favourites and payments.

---

##  Authentication

Havenly supports:

- Email and password login
- Google login
- JWT authentication
- Protected routes
- Admin-only routes

There are two main user roles:

```text
customer
admin
```

---

##  Payments

Havenly uses **Paystack** for online payments.

The payment process is connected to customer bookings.

Payment information is stored in the database so the application can keep track of payment status.

---

##  Images

Accommodation images are stored using **Cloudinary**.

Admins can upload and delete accommodation images from the admin dashboard.

---

##  Maps

Havenly uses **Leaflet** and **React Leaflet** to display accommodation locations.

Accommodation latitude and longitude are stored in the database.

---

##  Getting Started

### 1. Clone the project

```bash
git clone https://github.com/Masande07i/hotelApp.git
cd hotelApp
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Add environment variables

Create a `.env` file inside the `backend` folder.

Example:

```env
PORT=3000

DATABASE_URL=your_neon_database_url

JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

PAYSTACK_SECRET_KEY=your_paystack_secret_key

FRONTEND_URL=http://localhost:5173
```

**Do not upload your `.env` file to GitHub.**

---

##  Running the Project

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

The frontend normally runs on:

```text
http://localhost:5173
```

The backend normally runs on:

```text
http://localhost:3000
```

---

##  Main API Routes

```text
/api/auth
/api/users
/api/accommodations
/api/rooms
/api/bookings
/api/favourites
/api/reviews
/api/payments
```

---

##  Testing

API requests can be tested using:

- Postman
- Thunder Client

The main areas to test are:

- Authentication
- Accommodations
- Rooms
- Bookings
- Favourites
- Reviews
- Payments
- Admin access

---

##  Deployment

The backend is deployed using **Render**.

The database is hosted using **Neon**.

Cloudinary is used for image storage and Paystack is used for payments.

---

##  Future Improvements

Some possible improvements include:

- Better room availability checking
- Email booking confirmations
- Password reset
- Notifications
- Admin analytics
- More advanced accommodation filters
- Automated testing
- Improved mobile design

---

## Author

**Masande**

Computer Science and IT Graduate

GitHub: **Masande07i**

---

##  Project Status

Havenly is a full-stack hotel booking application currently under development.

The main customer and admin functionality has been implemented, including authentication, accommodations, rooms, bookings, favourites, reviews, payments, maps and image uploads.
