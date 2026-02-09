import { Router } from "express";
import { container } from "../di/container";
import { TYPES } from "../di/types";
import { ITripController } from "../controller/interfaces/iTripController";
import { uploadCSV } from "../middlewares/multerMiddleware";
import { tripRoutes } from "../const/routeConstants";
import { authenticate } from "../middlewares/authenticationMiddleware";

const routes = Router();

const tripController = container.get<ITripController>(TYPES.TripController);

routes.post(
  tripRoutes.upload,
  uploadCSV.single("file"),
  authenticate,
  (req, res, next) => {
    tripController.uploadTrip(req, res, next);
  },
);

routes.get("/", authenticate, (req, res, next) => {
  tripController.getTrips(req, res, next);
});

export default routes;
