import { Data, pairs } from "./data";
import { MutableTable } from "./table";
import { Headers } from "./headers";
import { Log } from "./log";
import { Method, URI, URL, Body } from "./http";
import { Request } from "./request";


interface Args {
    [key: string]: string ;
}


class EndpointData extends Data<Endpoint> {
}


class EndpointTable extends MutableTable<Endpoint> {
}


export class ServiceError extends Error {
}


/**
 * Instances are abstract and use relative URIs.
 */
export class Service {
    protected table: EndpointTable;
    protected endpoints: EndpointData;
    private _headers: Headers;
    protected log: Log;

    constructor (endpoints?: EndpointData, headers?: Headers) {
        endpoints = endpoints || this.endpoints || {};
        // TODO copy
        this.table = new EndpointTable(endpoints);
        this._headers = headers || new Headers();
    }

    private add_endpoints(endpoints: EndpointData) {
        // TODO: use some update() thingy here?
        // Table isn't mutable... blegh
        for (const pair of pairs(endpoints)) {
            const [key, value] = pair;
            this.table.set(key, value);
            // this.data[pair[0]] = pair[1];
        }
    }

    endpoint(name: string): Endpoint {
        return this.table.get(name);
    }

    uri(endpoint_name: string, args: Args): URI {
        const endpoint = this.endpoint(endpoint_name);
        return endpoint.uri(args);
    }

    url(base: URL, endpoint_name: string, args?: Args): URL {
        const endpoint = this.endpoint(endpoint_name);
        if (!endpoint) {
            const keys = this.table.keys().join(", ") || "no endpoints!";
            throw new Error(
                `no endpoint named ${endpoint_name}.
                available endpoints for this service: ${keys}`,
            );
        }
        return endpoint.url(base, args) as URL;
    }

    headers(endpoint_name: string, headers?: Headers): Headers {
        const endpoint = this.endpoint(endpoint_name);
        const result: Headers = this._headers.copy();
        for (const pair of endpoint.headers.pairs()) {
            const [key, value] = pair;
            result.set(key, value);
        }
        if (headers) {
            for (const pair of headers.pairs()) {
                const [key, value] = pair;
                result.set(key, value);
            }
        }
        return result;
    }

    // seems useless with these weird signatures
    // frontend(client: Client, base: URL): ServiceFrontend {
    //     return new ServiceFrontend(
    //         this,
    //         client,
    //         base,
    //     );
    // }
}


/**
 * Instances are abstract and use relative URIs.
 *
 * Intentionally no name on it: there may be any number of names used
 * externally for the same object, it's all arbitrary, but we don't want to
 * couple to one.
 */
export class Endpoint {
    _uri: URI;
    methods: Method[];
    headers: Headers;

    constructor (uri: URI, methods?: Method[], headers?: Headers) {
        this._uri = uri;
        this.methods = methods || [];
        this.headers = headers || new Headers();
    }

    uri(args?: Args): URI {
        // TODO: serialize args somehow
        return this._uri; // TODO
    }

    url(base: URL, args?: Args): URL {
        // TODO: base prefix sanity check.

        // Compose URI, but ensure we strip any redundant slashes before join
        const uri = this.uri(args).replace(/^[/]+/g, "");
        return `${base}/${uri}` as URL;
    }
}
