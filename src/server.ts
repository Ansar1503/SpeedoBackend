import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/databse";
import { errorHandler } from "./middlewares/errorHandlingMiddleware";
import { api, tripRoutes } from "./const/routeConstants";
import triprouters from "./routes/tripRoutes";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use(`${api}${tripRoutes.trips}`, triprouters);

const start = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();
