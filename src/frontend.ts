import { Response, parse_response } from "./response";
import { Point } from "./point";
import { Data, pairs } from "./data";
import { Table, MutableTable } from "./table";
import { TokenData, JWT, response_to_jwt } from "./token";
import { Query } from "./query";
import { Headers } from "./headers";
import { Client } from "./client";
import { Transfer } from "./transfer";
import { Logger } from "./logger";
import { Service, Endpoint } from "./service";
import { Route, parse_route } from "./route";
import { Host } from "./host";
import { BasemapService } from "./services/basemaps";
import { GeocodingService } from "./services/geocoding";
import { RoutingService } from "./services/routing";
import { SearchService } from "./services/search";
import { TokenService } from "./services/tokens";
import { ServiceFrontend } from "./service_frontend";
import {
    Method,
    URI,
    URL,
    Body,
    Request,
} from "./request";


// TODO: BrowserFrontend, NodeFrontend. I guess. to select Client?
// blegh not great.

// TODO: base URL registry and take env name instead of taking base.
// TODO: load it from yaml.

class BecauseError extends Error {
}

class LoginError extends BecauseError {
}

class ParseError extends BecauseError {
    response: Response;

    constructor (message: string, response: Response) {
        super(message);
        this.response = response;
    }
}


// TODO: allow definition of default routing and geocode providers?

/**
 * The nice interface for getting things done, top level of API for endusers.
 * Should take user-level config, e.g. OPTIONAL env = "dev" and not a long base
 * URL or having to know what a base URL is.
 */
export class Frontend {
    client: Client;
    host: Host;
    // base: URL;
    protected log: Logger;
    jwt: JWT | undefined;

    services: {[name: string]: Service} = {
        "tokens": new TokenService(),
        "basemaps": new BasemapService(),
        "geocoding": new GeocodingService(),
        "routing": new RoutingService(),
    };


    frontends: {[index: string]: ServiceFrontend};

    debug: boolean;

    constructor (client: Client, host: Host, debug?: boolean) {
        this.client = client;
        this.host = host;
        this.debug = debug || false;
        this.jwt = undefined;
        this.log = new Logger("because");

        // Instantiate ServiceFrontend for each service
        this.frontends = {};
        for (const pair of pairs(this.services)) {
            const [name, service] = pair;
            const frontend = new ServiceFrontend(
                service,
                this.client,
                this.host,
            );
            this.frontends[name] = frontend;
        }
    }

    /**
     * Get a token and cache it on this instance.
     */
    async login(username: string, password: string) {
        // These are for JS consumers, ts should normally prevent this
        if (!username) {
            throw new LoginError("username is required");
        }
        if (!password) {
            throw new LoginError("password is required");
        }
        const query = new Query({"username": username, "password": password});
        const response = await this.frontends.tokens.get("token", query);
        const jwt = response_to_jwt(response);
        this.jwt = jwt;
        return jwt;
    }

    send(method: Method, url: URL, query: Query, body: Body, headers?: Headers) {
        // TODO: augment with header if present
        let rheaders = headers;
        if (this.jwt) {
            rheaders = headers ? headers.copy() : new Headers();
            rheaders.set("User-Agent", "Because");
            rheaders.set("Accept", "application/json");
            rheaders.set("Authorization", `Bearer ${this.jwt.token}`);
        }
        this.log.debug({"headers": rheaders});
        const request = new Request(method, url, query, body, rheaders);
        this.log.debug({"request": request});
        const transfer = this.client.send(request);
        this.log.debug({"transfer": transfer});
        return transfer;
    }

    /**
     * Shortcut for getting a route.
     */
    async route(addresses: Address[], service?: string) {
        if (!this.jwt || !this.jwt.token) {
            throw new Error("not logged in");
        }
        service = service || "mapbox";
        const routable_count = 2;
        if (addresses.length < routable_count) {
            // Not enough to route with
            return undefined;
        }
        this.log.debug({"addresses": addresses});
        const joined = addresses.join("|");
        this.log.debug({"joined": joined});
        const query = new Query({
            "waypoints": joined || "",
        });
        const url = `${this.host.url}/route/${service}/`;
        this.log.debug({"url": url});
        const response = await this.send("GET", url, query, "");
        this.log.debug({"response": response});
        return parse_route(response);
    }

    async route_addresses(...addresses: Address[]) {
        // // TODO: what if nothing is passed?
        // const endpoint = this.endpoints.waypoints;
        // const args = {
        // };
        // const url = "https://www.example.com";
        // const request = new Request("GET", url);
        // const transfer = undefined;
        // await transfer;
    }

    // TODO: later.
    async route_points(...points: Point[]) {
        // TODO: what if nothing is passed?
    }


    /**
     * Shortcut for getting a set of geocode candidates.
     */
    async geocode() {
        const service = this.services.geocoding;
    }

    /**
     * Shortcut for getting a set of reverse geocode candidates.
     */
    async reverse_geocode() {
        const service = this.services.geocoding;
    }

    /**
     * Shortcut for getting a list of basemaps.
     * TODO: name sucks. could just use because.basemaps.metadata()
     */
    async basemap_metadata() {
        const service = this.services.basemaps;

        const uri = "/basemaps/";
        const url = this.host.url + uri;
        const request = new Request(
            "GET", url,
        );
        const transfer = this.client.transfer(request);
        // TODO: don't just return the transfer, munge it here
        return transfer;
    }
}
