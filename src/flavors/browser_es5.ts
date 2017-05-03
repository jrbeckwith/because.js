/**
 * Implementation targeting ES5 in the browser, using vanilla XMLHttpRequest.
 */

/** This line does nothing but make typedoc render the module comment. */

import { Request } from "../request";
import { Response } from "../response";
import { ClientBase } from "../client";
import { TransferBase } from "../transfer";
import { Body } from "../http";
import { XHR } from "../xhr";


/**
 * Transfer implementation for browser_es5.
 */
export class BrowserTransfer extends TransferBase {
    // Each instance gets its own instance of XMLHttpRequest bound to its
    // listener callacks. Neither a transfer nor an XHR should be reused for
    // multiple HTTP requests.
    private xhr: XHR;

    constructor (request: Request, timeout?: number) {
        super(request);
        this.timeout = timeout || 0;
        this.xhr = this.new_xhr();
    }

    /**
     * Create an XMLHttpRequest that tells this when things happen.
     */
    private new_xhr(): XHR {
        const xhr = new XHR(this.timeout || 0);

        // const xhr = new XMLHttpRequest();
        const listen = (name: string, bindable: Function) => {
            const bound = bindable.bind(this);
            xhr.listen(name, bound);
            // xhr.addEventListener(name, bound);
        };
        listen("loadstart", this.on_loadstart);
        listen("progress", this.on_progress);
        listen("load", this.on_load);
        listen("loadend", this.on_loadend);
        listen("abort", this.on_abort);
        listen("error", this.on_error);
        listen("timeout", this.on_timeout);
        return xhr;
    }

    protected finish(cause: string): void {
        super.finish(cause);
    }

    public async promise(): Promise<Response> {
        const headers = (
            this.request.headers
            ? this.request.headers.pairs()
            : []
        );
        // Mark that we're working for benefit of callers holding transfer.
        this.started = true;
        // Get the XHR rolling.
        const body = this.request.body || "";
        console.log("xhr body", body);
        this.xhr.start(
            this.request.method,
            this.request.url,
            headers,
            body as string,
        );
        await this.xhr.promise();
        return this.response;
    }

    // TODO: add progress interface
    // TODO: add callback for doneness if not using the promise?

    /**
     * Expose response for callers holding the transfer object.
     */
    get response() {
        // Auto-unpack response
        return this.xhr.response;
    }

    public abort() {
        if (this.xhr) {
            this.xhr.abort();
        }
        this.aborted = true;
    }

    // The following methods are used as event listeners called by the xhr to
    // keep the transfer informed of the latest, so that callers holding a
    // reference to the transfer can check it out as needed.

    /**
     * Progress begun.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/loadstart
     */
    on_loadstart(ev: ProgressEvent) {
        this.receive_progress.update_from_event(ev);
    }

    /**
     * Progress update.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/progress
     */
    on_progress(ev: ProgressEvent) {
        this.receive_progress.update_from_event(ev);
    }

    /**
     * Finished loading.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/load
     */
    on_load(ev: UIEvent) {
        this.finish("load");
    }

    /**
     * Request completed, whether or not successful.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/loadend
     */
    on_loadend(ev: ProgressEvent) {
        this.receive_progress.update_from_event(ev);
        this.finish("loadend");
    }

    /**
     * Request aborted, e.g. by a user action.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/abort
     */
    on_abort(ev: UIEvent | Event) {
        this.finish("abort");
    }

    /**
     * Failed to load.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/error
     */
    on_error(ev: UIEvent | Event) {
        this.error = ev;
        this.finish("error");
    }

    /**
     * The preset timeout expired.
     *
     * https://developer.mozilla.org/en-US/docs/Web/Events/timeout
     */
    on_timeout(ev: ProgressEvent) {
        this.finish("timeout");
        this.receive_progress.update_from_event(ev);
    }
}


/**
 * Client implementation for browser_es5.
 */
export class BrowserClient extends ClientBase {
    constructor () {
        super(BrowserTransfer);
    }
}
