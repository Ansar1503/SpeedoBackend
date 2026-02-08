import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { ITripController } from "../controller/interfaces/iTripController";
import { uploadCSV } from "../middlewares/multerMiddleware";

const routes = Router();

const tripController = container.get<ITripController>(TYPES.TripController);

routes.post("/upload", uploadCSV.single("csv"), (req, res, next) =>
  tripController.uploadTrip(req, res, next),
);

export default routes;
