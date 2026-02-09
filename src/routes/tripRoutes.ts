import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { ITripController } from "../controller/interfaces/iTripController";
import { uploadCSV } from "../middlewares/multerMiddleware";
import { tripRoutes } from "../const/routeConstants";

const routes = Router();

const tripController = container.get<ITripController>(TYPES.TripController);

routes.post(
  `${tripRoutes.upload}`,
  uploadCSV.single("file"),
  tripController.uploadTrip,
);

export default routes;
