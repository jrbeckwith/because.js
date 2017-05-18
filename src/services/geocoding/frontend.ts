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
    async geocode(
        address: Address,
        // vestigial: "boundless" as in bcs-geocoding-boundless role
        provider?: "mapzen" | "mapbox",
    ) {
        await this.need_login();
        provider = provider || "mapbox";
        if (!address) {
            throw new Error("need an address to geocode");
        }

        const endpoint = this.service.endpoint("forward");
        const request = endpoint.request(this.host.url, {
            "provider": provider,
            "address": encodeURIComponent(address as string),
        });
        const response = await this.send(request);
        this.log.debug("geocode", {"response": response});
        return parse_geocodes(response);
    }

    // TODO: type provider with an enum
    /**
     * Get a list of possible addresses for a location.
     */
    async reverse_geocode(coordinates: Coordinates, provider?: string) {
        await this.need_login();
        if (!coordinates) {
            throw new Error("need coordinates to reverse geocode");
        }
        const endpoint = this.service.endpoint("reverse");
        const request = endpoint.request(this.host.url, {
            "provider": provider || "mapbox",
            "x": coordinates[1],
            "y": coordinates[0],
        });
        const response = await this.send(request);
        this.log.debug("reverse_geocode", {"response": response});
        return parse_geocodes(response);
    }
}
