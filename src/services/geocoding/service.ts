import { Response } from "../../response";
import { Service, Endpoint } from "../../service";
import { GeocodeData, Geocode } from "./geocode";
import { endpoints } from "./endpoints";


/**
 * HTTP interface definition for the BCS Geocoding service.
 */
export class GeocodingService extends Service {
    constructor () {
        super(endpoints);
    }

    parse(response: Response): Geocode[] {
        return Geocode.parse(response);
    }
}
