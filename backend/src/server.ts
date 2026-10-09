import express from 'express';
import dotenv from "dotenv";
import { testDbConnection } from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  await testDbConnection();
  app.use(express.json());
  app.use('/api/auth', authRoutes )
  app.use("/api", userRoutes);

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};
startServer();