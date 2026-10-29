import express from 'express';
import dotenv from "dotenv";
import { testDbConnection } from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import accommodationRoutes from "./routes/accommodationRoutes";
import accommodationImageRoutes from "./routes/accommodationImageRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import roomRoutes from "./routes/roomRoutes";
import favouriteRoutes from "./routes/favouriteRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  await testDbConnection();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/api/auth', authRoutes )
  app.use("/api/users", userRoutes);
  app.use("/api/accommodations", accommodationRoutes);
  app.use("/api/accommodations", accommodationImageRoutes);
  app.use("/api/rooms", roomRoutes);
  app.use("/api/bookings", bookingRoutes);
  app.use("/api/favourites", favouriteRoutes);
  app.use("/api/reviews", reviewRoutes);
  app.use("/api/payments", paymentRoutes);
  
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};
startServer();