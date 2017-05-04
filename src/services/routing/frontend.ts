import { Frontend } from "../../frontend";
import { Host } from "../../host";
import { Query } from "../../query";
import { ServiceFrontend } from "../../service_frontend";
import { parse_routings } from "./parse";
import { RoutingService } from "./service";
import { Route } from "./route";

import { Location, Point, Coordinates, is_coordinates } from "../../location";


export class RoutingFrontend extends ServiceFrontend {
    service: RoutingService;

    constructor (frontend: Frontend, host: Host) {
        const service = new RoutingService();
        super(service, frontend, host);
    }

    async get_routings() {
        const endpoint = this.service.endpoint("metadata");
        const request = endpoint.request(this.host.url, {});
        const response = await this.send(request);
        return parse_routings(response);
    }

    /**
     * Get a route.
     *
     * This accepts a list of locations which can either represent points or
     * addresses. The interface has to be polymorphic in case users actually
     * need to route through locations specified in different ways. Otherwise,
     * the client would have to do all the geocoding itself.
     *
     * @param locations     A list of locations - addresses or points.
     * @param service       The name of a service. Default "mapbox".
     */
    async route(locations: Location[], provider?: "mapbox" | "mapzen") {
        provider = provider || "mapbox";
        if (locations.length < 2) {
            throw new Error("need at least two locations to route");
        }

        const strings: string[] = [];
        for (const loc of locations) {
            let one: string;
            if (typeof loc === "string") {
                one = loc;
            }
            else if (loc instanceof Point) {
                one = `${loc.y},${loc.x}`;
            }
            else if (is_coordinates(loc)) {
                // service expects lon, lat
                one = `${loc[1]},${loc[0]}`;
            }
            else {
                const loc_type = (typeof loc);
                throw new Error(`unsupported location type: ${loc_type}`);
            }
            strings.push(one);
        }

        const endpoint = this.service.endpoint("waypoints");
        const request = endpoint.request(this.host.url, {
            "provider": provider,
            "waypoints": strings.join("|") || "",
        });
        const response = await this.send(request);
        return Route.parse(response);
    }
}
