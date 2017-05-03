import { Data, pairs } from "./data";
import { MutableTable } from "./table";
import { Headers } from "./headers";
import { Log } from "./log";
import { Method, URI, URL, Body } from "./http";
import { Request } from "./request";
import { Query } from "./query";
import { format } from "./format";


export interface Args {
    [key: string]: string | number;

}

export interface ArgsToQuery {
    (args: Args): Query;
}

export interface ArgsToHeaders {
    (args: Args): Headers;
}

export interface ArgsToBody {
    (args: Args): Body;
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
    public readonly method: Method;
    protected readonly _uri: URI;

    readonly query_function: ArgsToQuery;
    readonly default_query: Query;

    readonly headers_function: ArgsToHeaders;
    readonly default_headers: Headers;

    readonly body_function: ArgsToBody;
    readonly default_body: Body;

    constructor (
        method: Method,
        uri: URI,
        query?: Query | ArgsToQuery,
        headers?: Headers | ArgsToHeaders,
        body?: string | ArgsToBody,
    ) {
        this.method = method;
        this._uri = uri;

        if (!query || typeof query === "object") {
            this.default_query = query || new Query();
        }
        else if (typeof query === "function") {
            this.query_function = query;
        }

        if (!headers || typeof headers === "object") {
            this.default_headers = headers || new Headers();
        }
        else if (typeof headers === "function") {
            this.headers_function = headers;
        }

        if (!body || typeof body === "string") {
            this.default_body = body || "";
        }
        else if (typeof body === "function") {
            this.body_function = body;
        }
    }

    uri(args?: Args, append_query: boolean = false): URI {
        args = args || {};
        const string_args: {[key: string]: string} = {};
        for (const key of Object.keys(args)) {
            let value = args[key] || "";
            if (value === undefined) {
                value = "";
            }
            else if (typeof value === "number") {
                value = value.toString();
            }
            else {
                value = value;
            }
            string_args[key] = value;
        }

        const uri = format(this._uri as string, string_args) as URI;

        // Inline query: can't do this without messing up Request.
        if (append_query) {
            const query = this.query(args);
            const qs: string = query.encoded;
            if (qs) {
                return `${uri}?${qs}` as URI;
            }
        }
        return uri;
    }

    url(base: URL, args?: Args, append_query: boolean = false): URL {
        // Sanity check the passed base prefix
        if (!/^https?:\/\/.*$/.test(base as string)) {
            throw new Error(`invalid URL base ${base}`);
        }

        // Compose URI, but ensure we strip any redundant slashes before join
        const uri = this.uri(args, append_query).replace(/^[/]+/g, "");
        base = base.replace(/[/]+$/g, "");
        return `${base}/${uri}` as URL;
    }

    query(args?: Args): Query {
        let query: Query;
        if (this.query_function) {
            query = this.query_function(args || {});
        }
        else {
            query = this.default_query.copy();
        }
        return query;
    }

    headers(args?: Args): Headers {
        let headers: Headers;
        if (this.headers_function) {
            headers = this.headers_function(args || {});
        }
        else {
            headers = this.default_headers.copy();
        }
        return headers;
    }

    body(args?: Args): Body {
        let body: Body;
        if (this.body_function) {
            body = this.body_function(args || {});
        }
        else {
            body = this.default_body;
        }
        return body;
    }

    request(base: URL, args?: Args): Request {
        const query = this.query(args);
        const headers = this.headers(args);
        const body = this.body(args);
        const request = new Request(
            this.method,
            this.url(base, args, false),
            query,
            body,
            headers,
        );
        return request;
    }

}
