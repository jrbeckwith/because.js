import { Service } from "./service";
import { Client } from "./client";
import { Transfer } from "./transfer";
import { Host } from "./host";
import { Request, Method, Body } from "./request";
import { Query } from "./query";

/**
 * Frontend for a specific service.
 *
 * This contains per-service logic that would otherwise be in Frontend.
 * Code that needs to share state across services goes in Frontend
 * instead.
 */
export class ServiceFrontend {
    public service: Service;
    private _client: Client;
    // private _base: URL;
    public host: Host;

    /**
     * @param client    Client to send requests with.
     * @param base      Absolute URL to construct URLs with.
     * @param headers   Base headers to use in all requests.
     */
    constructor (
        service: Service, client: Client, host: Host,
    ) {
        this.service = service;
        this._client = client;
        // Validate that base is absolute
        // if (!base.startsWith("http://") || !base.startsWith("https://")) {
        //     throw new Error("base URL must start with an http scheme");
        // }
        // this._base = base;
        this.host = host;
    }

    // TODO: instead of query, take args
    // these can be validated abstractly

    request(
        endpoint: string,
        method: Method,
        query?: Query,
        body?: Body,
    ): Request {
        // TODO: check method validity

        // TODO: check uri validity, can't be absolute

        // TODO: check query validity

        const url = this.service.url(this.host.url, endpoint);
        const headers = this.service.headers(endpoint);
        const request = new Request(
            method,
            url as string,
            query,
            body as string,
            headers,
        );
        return request;
    }

    send(
        method: Method,
        endpoint: string,
        query?: Query,
        body?: Body,
        headers?: Headers,
    ): Transfer {
        const request = this.request(
            endpoint,
            method as Method,
            query,
            body as Body,
        );
        return this._client.send(request);
    }

    get(endpoint: string, query?: Query, headers?: Headers) {
        return this.send(
            "GET",
            endpoint,
            query,
            "",
            headers,
        );
    }

    post(endpoint: string, query?: Query, body?: Body, headers?: Headers) {
        return this.send(
            "POST",
            endpoint,
            query,
            body,
            headers,
        );
    }

    // get base() {
    //     return this._base;
    // }

    // request(endpoint: Endpoint, method: Method, args?: {}) {
    //     return new Request(
    //         <string> method,
    //         <string> endpoint.url(this.base, args || {}),
    //     );
    // }
}


interface ServiceFrontendConstructor {

    new (
        service: Service,
        client: Client,
        host: Host,
    ): ServiceFrontend;
}


