import { Service, Endpoint } from "../service";
import { GeocodeData, Geocode } from "./geocode";


/**
 * HTTP interface definition for the BCS Geocoding service.
 */
export class GeocodingService extends Service {
    constructor () {
        const endpoints = {

            "forward": new Endpoint(
                "/geocode/{service}/address/{address}",
            ),

            "reverse": new Endpoint(
                "/geocode/{service}/address/x/{x}/y/{y}",
            ),

            // TODO
            // "batch": new Endpoint(
            // ),

        };
        super(endpoints);
    }

    parse(response: Response): Geocode[] {
        return Geocode.parse(response);
    }
}
