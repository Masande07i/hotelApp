import express from 'express';
import dotenv from "dotenv";
import { testDbConnection } from "./config/database";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await testDbConnection();

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
};
startServer();