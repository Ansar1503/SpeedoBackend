import express, { Request, Response } from "express";
import { tripRoutes } from "../const/routeConstants";
import { uploadCSV } from "../middlewares/multerMiddleware";

const routes = express.Router();

routes.post(`${tripRoutes.trips}${tripRoutes.upload}`, uploadCSV.single("csv"),);
