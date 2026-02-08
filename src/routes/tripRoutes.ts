import express from "express";
import { tripRoutes } from "../const/routeConstants";
import { uploadCSV } from "../middlewares/multerMiddleware";

const routes = express.Router();

routes.post(`${tripRoutes.upload}`, uploadCSV.single("csv"));

export default routes