import { URI } from "./http";
import { Response } from "./response";
import { Service } from "./service";
import { Client } from "./client";
import { Transfer } from "./transfer";
import { Host } from "./host";
import { Method, Body } from "./http";
import { Request } from "./request";
import { Query } from "./query";
import { Log } from "./log";
import { Frontend } from "./frontend";

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
        console.log("sending request", request);
        return this._frontend.send(request);
    }

    old_send(
        method: Method,
        endpoint: string,
        query?: Query,
        body?: Body,
        headers?: Headers,
    ): Transfer {
        const request = this.request(
            method as Method,
            endpoint,
            query,
            body as Body,
        );
        return this._frontend.send(request);
    }

    async get(endpoint: string, query?: Query) {
        const request = this.request(
            "GET" as Method,
            endpoint,
            query,
            "",
        );
        return await this.send(request);
    }

    async post(endpoint: string, query?: Query, body?: Body) {
        const request = this.request(
            "POST" as Method,
            endpoint,
            query,
            body,
        );
        this.send(request);
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
