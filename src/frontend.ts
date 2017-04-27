// General utilities
import { pairs } from "./data";
import { Log } from "./log";

// Base
import { InvalidObject } from "./errors";

// HTTP request/response processing
import { Host } from "./host";
import { Method, URI, URL, Body } from "./http";
import { Username, Password, LoginError } from "./auth";
import { Request } from "./request";
import { Query } from "./query";
import { Headers } from "./headers";
import { Client } from "./client";
import { Transfer } from "./transfer";
import { ServiceFrontend } from "./service_frontend";

// We always use the token service for login
import { JWT } from "./services/token/jwt";
import { TokenFrontend } from "./services/token/frontend";

// We may also use other services
import { FrontendClass } from "./service_frontend";
import { RoutingFrontend } from "./services/routing/frontend";
import { BasemapFrontend } from "./services/basemap/frontend";
import { GeocodingFrontend } from "./services/geocoding/frontend";
import { SearchFrontend } from "./services/search/frontend";

class Provider extends String {
}


/**
 * The nice interface for getting things done, top level of API for endusers.
 * Should take user-level config, e.g. OPTIONAL env = "dev" and not a long base
 * URL or having to know what a base URL is.
 */
export class Frontend {
    // jwt is exposed so that users don't have to directly handle results from
    // login() to get at things like roles when needed. Almost any
    // use case is likely to need access to this at some point, it shouldn't
    // require a lot of adaptation on the part of the user to get at it.
    public jwt: JWT | undefined;

    // an instance's logger should generally only reflect the "voice" of that
    // particular instance. This is enforced by making it private to the class
    // and whatever the class shares the logger with.
    protected log: Log;

    tokens?: TokenFrontend;
    basemaps?: BasemapFrontend;
    geocoding?: GeocodingFrontend;
    routing?: RoutingFrontend;
    search?: SearchFrontend;

    default_headers = new Headers({
        "User-Agent": "Because",
        "Accept": "application/json",
    });

    constructor (
        public classes: {[name: string]: FrontendClass},
        private client: Client,
        public host: Host,
        public debug?: boolean,
    ) {
        if (!classes) {
            throw new InvalidObject(
                "must pass an object mapping frontend classes",
            );
        }
        if (!client) {
            throw new InvalidObject(
                "must pass a client",
            );
        }
        if (!host || !(host instanceof Host)) {
            throw new InvalidObject(
                "must pass a Host instance",
            );
        }
        this.client = client;
        this.host = host;
        this.debug = debug || false;
        this.jwt = undefined;
        this.log = new Log("because");

        // Always get a TokenFrontend so we can log in
        this.tokens = new TokenFrontend(this, host);

        // Use the passed ServiceFrontends
        this.add_service_frontends(classes);
    }

    private add_service_frontends(classes: {[name: string]: FrontendClass}) {
        for (const pair of pairs(classes)) {
            const name: string = pair[0];
            const cls: FrontendClass = pair[1];
            const frontend = new cls(this, this.host);
            this.add_service_frontend(frontend);
        }
    }

    private add_service_frontend(frontend: ServiceFrontend) {
        // TODO: has to be a better way
        if (frontend instanceof TokenFrontend) {
            this.tokens = frontend;
        }
        else if (frontend instanceof BasemapFrontend) {
            this.basemaps = frontend;
        }
        else if (frontend instanceof GeocodingFrontend) {
            this.geocoding = frontend;
        }
        else if (frontend instanceof RoutingFrontend) {
            this.routing = frontend;
        }
        else if (frontend instanceof SearchFrontend) {
            this.search = frontend;
        }
    }

    /**
     * Construct a request with the appropriate User-Agent and Auth headers.
     */
    request(
        method: Method,
        uri: URI,
        query?: Query,
        body?: Body,
        headers?: Headers,
    ): Request {
        headers = headers ? headers.copy() : new Headers();
        this.enrich_headers(headers);
        const url = `${this.host.url}/${uri}`;
        return new Request(method, url, query, body, headers);
    }

    private enrich_headers(headers: Headers) {
        headers.update(this.default_headers);
        if (this.jwt) {
            headers.set("Authorization", `Bearer ${this.jwt.token}`);
        }
    }

    /**
     * Get a token and cache it on this instance for reuse.
     *
     * This should normally be preferred to ensure that tokens are locally
     * cached, avoid redundant HTTP requests, and provide better ease-of-use.
     */
    async login(username: Username, password: Password) {
        const frontend: TokenFrontend | undefined = this.tokens;
        let jwt: JWT | undefined;
        if (frontend) {
            jwt = await frontend.get_token(username, password);
            this.jwt = jwt;
        }
        else {
            this.log.error("cannot login without token service loaded");
        }
        return jwt;
    }

    /**
     * Encapsulate this.client.send.
     *
     * If other methods use this method instead of directly calling
     * this.client.send, then this instance can uniformly enforce policy around
     * requests, like logging and 403 handling.
     */
    send(request: Request): Transfer {
        this.enrich_headers(request.headers);
        this.log.debug("about to send", {"request": request});
        const transfer = this.client.send(request);
        return transfer;
    }

    /**
     * Assert that we have a token to log in with.
     *
     * Methods on this class can simplify their implementation by awaiting this
     * to ensure they do not issue any requests without having a token to send.
     *
     * In the future this may be changed to automatically accomplish login if
     * there is a way to do that.
     */
    private async need_login() {
        if (!this.jwt || !this.jwt.token) {
            throw new Error("not logged in");
        }
        return this.jwt;
    }

}
