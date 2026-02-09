import { Container } from "inversify";
import { TYPES } from "./types";
import { TripController } from "../controller/tripController";
import { ITripController } from "../controller/interfaces/iTripController";
import { ITripService } from "../services/interfaces/iTripServices";
import { TripService } from "../services/tripServices";

const container = new Container();
container.bind<ITripService>(TYPES.TripService).to(TripService);
container.bind<ITripController>(TYPES.TripController).to(TripController);

export { container };
