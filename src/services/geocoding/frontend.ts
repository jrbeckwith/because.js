import { Log } from "../../log";
import { Frontend } from "../../frontend";
import { Host } from "../../host";
import { Query } from "../../query";
import { Address, Coordinates } from "../../location";
import { ServiceFrontend } from "../../service_frontend";
import { GeocodingService } from "./service";
import { parse_geocodes } from "./parse";


export class GeocodingFrontend extends ServiceFrontend {
    service: GeocodingService;

    constructor (frontend: Frontend, host: Host) {
        const service = new GeocodingService();
        super(service, frontend, host);
        this.log = new Log("geocoding");
    }

    // TODO: type provider with an enum
    /**
     * Get a list of possible locations for an address.
     */
    async geocode(address: Address, provider?: string) {
        // TODO
        // await this.need_login();
        provider = provider || "mapbox";
        if (!address) {
            throw new Error("need an address to geocode");
        }
        const query = new Query({
        });

        const request = this.request("GET", "forward", query);
        // TODO
        const encoded = encodeURIComponent(address as string);
        request._url = request._url + `geocode/${provider}/address/${encoded}`;
        const response = await this.send(request);
        this.log.debug("geocode", {"response": response});
        return parse_geocodes(response);
    }

    // TODO: type provider with an enum
    /**
     * Get a list of possible addresses for a location.
     */
    async reverse_geocode(coordinates: Coordinates, provider?: string) {
        // TODO
        // await this.need_login();
        if (!coordinates) {
            throw new Error("need coordinates to reverse geocode");
        }
        const x: number = coordinates[1];
        const y: number = coordinates[0];
        provider = provider || "mapbox";
        const query = new Query({});
        const request = this.request("GET", "reverse", query);
        // TODO
        request._url = request._url + `geocode/${provider}/address/x/${x}/y/${y}`;
        const response = await this.send(request);
        this.log.debug("reverse_geocode", {"response": response});
        return parse_geocodes(response);
    }
}
