/**
 * Utilities for working with HTTP response data.
 */

/** This line does nothing but make typedoc render the module comment. */

import { InvalidObject } from "./errors";
import { Headers, HeaderData } from "./headers";


/**
 * Interchange format for data in HTTP response headers.
 */
export class ResponseHeaderData extends HeaderData {
}


export class InvalidResponse extends InvalidObject {
}


/* Hold data on one HTTP response which might have been received.
 *
 * Only makes sense if the request is complete.
 */
export class Response {
    // HTTP response status code, as an integer.
    // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/status
    public readonly status: number;

    // Mapping of received headers.
    private _headers: Headers;
    private _get_headers: (() => Headers);

    // Raw data from the response body.
    public readonly body: string;

    constructor (
        status: number,
        headers?: Headers | ResponseHeaderData | (() => Headers),
        body?: string,
    ) {
        this.status = status;
        if (headers instanceof Headers) {
            this._headers = headers;
        }
        else if (headers instanceof Function) {
            this._get_headers = headers;
        }
        else {
            this._headers = new Headers(headers || {});
        }
        this.body = body || "";
    }

    get headers() {
        if (!this._headers) {
            this._headers = this._get_headers();
        }
        return this._headers;
    }
}
