import { Service, Endpoint } from "../service";
import { URI } from "../request";
import { Route } from "./route";


export class RouteError extends Error {
}


/**
 * Definition of the routing service.
 */
export class RoutingService extends Service {
    _uri: URI;

    constructor () {
        const data = {
            "waypoints": new Endpoint(
                "/route/{service}/",
            ),
        };
        super(data);
    }

}
