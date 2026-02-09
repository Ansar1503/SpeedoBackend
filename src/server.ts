import express from "express";
import cors from "cors";
import "dotenv/config";
import "reflect-metadata";
import connectDB from "./config/databse";
import { errorHandler } from "./middlewares/errorHandlingMiddleware";
import { api, authRoutes, tripRoutes } from "./const/routeConstants";
import triprouters from "./routes/tripRoutes";
import authRouter from "./routes/authRoutes";

const PORT = process.env.PORT || 8000;
const FrontendApi = process.env.FRONTEND_API || "http://localhost:3000";

const app = express();

app.use(
  cors({
    origin: [FrontendApi],
    credentials: true,
  }),
);
app.use(express.json());
app.use(errorHandler);

app.use(`${api}${tripRoutes.trips}`, triprouters);
app.use(`${api}${authRoutes.auth}`, authRouter);

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();
