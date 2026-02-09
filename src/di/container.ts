import { Container } from "inversify";
import { TYPES } from "./types";
import { TripController } from "../controller/tripController";
import { ITripController } from "../controller/interfaces/iTripController";
import { ITripService } from "../services/interfaces/iTripServices";
import { TripService } from "../services/tripServices";
import { ITripRepository } from "../repository/interface/iTripInterface";
import { TripRepository } from "../repository/implementations/tripRepository";
import { IGPSRepository } from "../repository/interface/iGpsRepository";
import { GPSRepository } from "../repository/implementations/gpsRepository";
import { ITokenService } from "../services/interfaces/iJwtServices";
import { TokenService } from "../services/JwtServices";

const container = new Container();
container.bind<ITripController>(TYPES.TripController).to(TripController);
container.bind<ITripService>(TYPES.TripService).to(TripService);
container.bind<ITripRepository>(TYPES.TripRepository).to(TripRepository);
container.bind<IGPSRepository>(TYPES.GPSRepository).to(GPSRepository);
container.bind<ITokenService>(TYPES.TokenService).to(TokenService);

export { container };
