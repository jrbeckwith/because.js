import { URI } from "./http";
import { Response } from "./response";
import { Headers } from "./headers";
import { Service } from "./service";
import { Client } from "./client";
import { Transfer } from "./transfer";
import { Host } from "./host";
import { Method, Body } from "./http";
import { Request } from "./request";
import { Query } from "./query";
import { Log } from "./log";
import { Frontend } from "./frontend";
import { Args } from "./service";

/**
 * Frontend for a specific service.
 *
 * This contains per-service logic that would otherwise be in Frontend.
 * Code that needs to share state across services goes in Frontend
 * instead.
 */
export class ServiceFrontend {
    public service: Service;
    protected _frontend: Frontend;
    public host: Host;
    protected log: Log;

    /**
     * @param service   Service instance to wrap.
     * @param frontend  Frontend to send requests with.
     * @param host      Description of host to send requests to.
     */
    constructor (
        service: Service, frontend: Frontend, host: Host,
    ) {
        this.service = service;
        this._frontend = frontend;
        this.host = host;
        this.log = new Log("ServiceFrontend");
    }

    // TODO: instead of query, take args
    // these can be validated abstractly

    request(
        method: Method,
        endpoint: URI,
        query?: Query,
        body?: Body,
        // headers?: Headers,
    ): Request {
        // TODO: check method validity

        // TODO: check uri validity, can't be absolute

        // TODO: check query validity

        const url = this.service.url(this.host.url, endpoint as string);
        const headers = this.service.headers(endpoint as string);
        const request = new Request(
            method,
            url as string,
            query,
            body as string,
            headers,
        );
        return request;
    }

    // request(endpoint: Endpoint, method: Method, args?: {}) {
    //     return new Request(
    //         <string> method,
    //         <string> endpoint.url(this.base, args || {}),
    //     );
    // }

    send(request: Request): Transfer {
        this.log.debug("send", {"request": request});
        return this._frontend.send(request);
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
    protected async need_login() {
        const jwt = this._frontend ? this._frontend.jwt : undefined;
        if (!jwt || !jwt.token) {
            throw new Error("not logged in");
        }
        return jwt;
    }
}


export interface ServiceFrontendConstructor {

    new (
        service: Service,
        client: Client,
        host: Host,
    ): ServiceFrontend;
}


export interface FrontendClass {
    new (
        frontend: Frontend,
        host: Host,
    ): ServiceFrontend;
}
