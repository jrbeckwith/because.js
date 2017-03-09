import { URI } from "../../http";
import { Service, ServiceError } from "../../service";
import { endpoints } from "./endpoints";


export class RoutingServiceError extends ServiceError {
}


/**
 * HTTP interface definition for the routing service.
 */
export class RoutingService extends Service {
    _uri: URI;

    constructor () {
        super(endpoints);
    }
}
