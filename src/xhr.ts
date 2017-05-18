import { BecauseError } from "./errors";
import { Request } from "./request";
import { Response } from "./response";
import { Headers } from "./headers";


class XHRError extends BecauseError {
    event: Event;

    // TODO: translate event information into something presented
    constructor (message: string, ev: Event, text?: string) {
        super(message, text || message);
        this.event = ev;
    }
}


/**
 * Unpack data from a completed XMLHttpRequest into a Response object.
 */
function xhr_to_response(xhr: XMLHttpRequest): Response {

    // Pass an argless callback that will be invoked lazily to do parsing;
    // most of the time response won't even need this data
    const will_parse_headers = () => {
        const blob: ByteString = xhr.getAllResponseHeaders();
        return Headers.parse(blob);
    };

    const response = new Response(
        xhr.status,
        will_parse_headers,
        xhr.responseText,
    );
    return response;
}


/**
 * Wrap an XMLHttpRequest in a promise that can be awaited.
 *
 * This intentionally doesn't do any interpretation of the XHR. That stuff can
 * be done later in the promise chain.
 *
 * An existing XHR can be passed so that it can be prepared however necessary
 * before passing it in here.
 *
 */
async function xhr_to_promise(xhr: XMLHttpRequest) {

    // If the XHR is already done, return an already-resolved Promise.
    const finished = 4;
    if (xhr.readyState === finished) {
        return Promise.resolve(xhr);
    }

    // Otherwise, return a more complicated Promise wired to the XHR...
    return new Promise((resolve, reject) => {
        // Flag used to ensure that reject xor resolve is called exactly once.
        const flags = {"done": false};

        // What is done on successful *load* (INCLUDING HTTP errors 4xx/5xx).
        // Closes over flags to ensure the one-call invariant.
        function succeed(ev: UIEvent) {
            // Do nothing if succeed or fail were already called
            if (!flags.done) {
                // Prevent another call
                flags.done = true;

                // Just return the XHR
                resolve(xhr);

                // Unpack the XMLHttpRequest and forward it on
                // const response = xhr_to_response(xhr);
                // resolve(response);
            }
        }

        // What is done in any other failure condition where XHR is done.
        // Closes over flags to ensure the one-call invariant
        const fail = (ev: Event) => {
            // Do nothing if succeed or fail were already called
            if (!flags.done) {
                // Prevent another call
                flags.done = true;

                // Export an Error describing the failure
                const error = new XHRError(
                    "XHR failed",
                    ev,
                );
                reject(error);
            }
        };

        // Load is success
        xhr.addEventListener("load", succeed);

        // Error, abort, and timeout are failures
        xhr.addEventListener("error", fail);
        xhr.addEventListener("abort", fail);
        xhr.addEventListener("timeout", fail);

        // Just in case other things didn't fire, loadend SHOULD fire after
        // error, abort, or load. If so, flags.done prevents a second call to
        // reject. If not, we definitely want to reject.
        xhr.addEventListener("loadend", fail);
    });
}


function xhr_start(
    xhr: XMLHttpRequest,
    method: string,
    url: string,
    headers?: [string, string][],
    body?: string,
) {
        xhr.open(method, url, true);
        if (headers) {
            for (const pair of headers) {
                const [key, value] = pair;
                xhr.setRequestHeader(key, value);
            }
        }
        xhr.send(body || "");
}


/**
 * Simple wrapper for XMLHttpRequest.
 *
 * Just a device for organizing XHR-related code.
 */
export class XHR {
    private xhr: XMLHttpRequest;
    private timeout: number;
    private _response: Response;

    constructor (timeout = 0) {
        this.xhr = new XMLHttpRequest();
        this.timeout = timeout;
    }

    /**
     * Add an event listener callback to the underlying XMLHttpRequest.
     */
    public listen(name: string, callback: (ev: Event) => void) {
        this.xhr.addEventListener(name, callback);
    }

    /**
     * Start a request running with the underlying XMLHttpRequest.
     *
     * For convenience, this returns a promise.
     */
    public async start(
        method: string, url: string, headers?: [string, string][],
        body?: string,
    ): Promise<this> {
        xhr_start(this.xhr, method, url, headers, body || "");
        return this.promise();
    }

    /**
     * Create a promise usable to wait on the underlying XMLHttpRequest.
     *
     * This intentionally returns a new promise each time.
     * This intentionally isn't tied to start, since you may want to
     * "subscribe" to an XHR more times than one starts it.
     */
    public async promise(): Promise<this> {
        await xhr_to_promise(this.xhr);
        return this;
    }

    /**
     * Get an unpacked response object for the underlying XMLHttpRequest.
     *
     * This intentionally caches and returns the same response object.
     */
    public get response(): Response {
        if (!this._response) {
            this._response = xhr_to_response(this.xhr);
        }
        return this._response;
    }

    public abort() {
        this.xhr.abort();
    }

}
