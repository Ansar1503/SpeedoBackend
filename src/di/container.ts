import { Container } from "inversify";
import { TYPES } from "./types";
import { TripController } from "../controller/tripController";
import { ITripController } from "../controller/interfaces/iTripController";

const container = new Container();

container.bind<ITripController>(TYPES.TripController).to(TripController);

export { container };
