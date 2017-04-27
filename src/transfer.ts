/**
 * A Transfer tracks the state of one HTTP request/response cycle.
 *
 * This is the interface and base implementation for Transfer implementations
 * designed around specific environments (e.g. browser on ES5 with XHR).
 */

/** This line does nothing but make typedoc render the module comment. */

import { Request } from "./request";
import { Response } from "./response";
import { Progress } from "./progress";


interface Resolve {
    (response: Response): void;
}

interface Reject {
    (reason: Error): void;
}

interface OnFulfill <T> {
    (response: Response): T;
}

interface OnReject <T> {
    (error: Error): T;
}

// Promise <R> implements Thenable <R>; here, R = Response.
export interface Transfer extends Promise <Response > {
    readonly request: Request;
    readonly response: Response;
    readonly send_progress: Progress;
    readonly receive_progress: Progress;
    readonly cause: string;
    readonly started: boolean;

    start(): void;
    abort(): void;

    // Interface for presenting a Transfer as a Promise, so we can directly run
    // transfer.then(...) instead of transfer.promise().then(...).
    // T is the type of value returned by the on_fulfill callback.
    then<T>(
        on_fulfill: OnFulfill<T>, // ((value: Response) => T),
        on_reject: OnReject<T>, // ((reason: Error) => T),
    ): Promise<T>;

    catch<T>(
        on_reject: OnReject<T>, // ((reason: Error) => T),
    ): Promise<T>;
}


// For use as a type annotation on variables that hold Transfer implementations
export interface TransferConstructor {
    new (request: Request): Transfer;
}

export class TransferBase implements Transfer {

    // Work around:
    // "Property '[Symbol.toStringTag]' is missing in type 'BrowserTransfer'."
    // This workaround requires tsconfig.json to include "es2015" under "lib"
    // under "compilerOptions". or else you will get:
    // "Property 'toStringTag' does not exist on type 'SymbolConstructor'."
    readonly [Symbol.toStringTag]: "Promise";

    request: Request;
    response: Response;
    error: Error | Event;
    started: boolean;
    aborted: boolean;
    finished: boolean;

    send_progress: Progress;
    receive_progress: Progress;

    protected timeout: number;
    protected _cause: string;

    /**
     * @param request   Request object representing what will be sent.
     * @param timeout   Milliseconds to timeout; 0 for no timeout.
     */
    constructor (request: Request, timeout?: number) {
        this.request = request;
        this.timeout = timeout || 0;
        this._cause = "";
        this.send_progress = new Progress();
        this.receive_progress = new Progress();
        // before started, we're not a promise.
        // once started = true, we're pending.
        this.started = false;
        // rejected
        this.aborted = false;
        // fulfilled
        this.finished = false;
        // TODO: we need a non-aborted way of saying things didn't work out
        // e.g. for timeouts, or for errors
    }

    start(): void {
        if (!this.started) {
            this.started = true;
        }
    }

    protected finish(cause: string): void {
        if (!this.finished) {
            this._cause = cause;
            this.finished = true;
        }
    }

    /**
     * Returns a promise, to support a Promises/A+ interface.
     *
     * TODO: can this also reasonably take a callback for finish notification?
     */
    public async promise(
        // on_fulfill?: OnFulfill<void>, // (response: Response) => void,
        // on_reject?: OnReject<void>, // (reason: Error) => void,
    ): Promise<Response> {
        this.start();
        // Dummy stub for the base.
        const resolved = Promise.resolve(new Response(0));
        return resolved;
    }

    /**
     * Promises/A+ interface.
     *
     * T is the type of value returned by the given callback.
     */
    public then <T>(
        on_fulfill: OnFulfill<T>,
        on_reject: OnReject<void>,
    ): Promise<T> | Promise<void> {
        // NOTE: we can't make this an "async" function without making
        // problems; presumably because ES7 requires not returning any specific
        // promise type.

        // Delegate to promise returned by this.start().
        // But we return Promise<T>, where T is whatever onfulfill returns.
        const promise1: Promise<Response> = this.promise();
        const promise2: Promise<T> = promise1.then(on_fulfill, on_reject);
        return promise2;
    }

    /**
     * Expose a Promise interface from Transfer.
     *
     * T is the type of value returned by the given callback.
     */
    public catch <T>(
        on_reject: OnReject<void>,  // ((reason: Error) => void),
    ): Promise<T> | Promise<void> {
        // NOTE: same async issue as we have for then().

        // Delegate to a promise returned by start().
        return this.promise().catch(on_reject);
    }

    public abort() {
        this.aborted = true;
    }

    get cause() {
        return this._cause;
    }

}
