/**
 * Base interface and implementation for Client implementations.
 *
 * A `Client` implementation, along with a `Transfer` implementation, defines a
 * way for this library to make HTTP requests, collect HTTP responses, and
 * allow monitoring of progress in between.
 *
 * This allows abstraction of the rest of the library away from details like
 * e.g. whether one is using Angular or vanilla XHR, fetch, Node, Bluebird,
 * ES2017 with async, etc. Then code for various things like validating
 * parameters, generating requests, parsing responses and creating nice objects
 * for results can be shared across implementations, because it is not coupled
 * to any particular implementation.
 *
 * And this allows users of this shared code to exploit it from whatever
 * environment *their* code wants to run in. It's a politeness when you have
 * people who want to use your code across different kinds of environments.
 */

/** This line does nothing but make typedoc render the module comment. */

import { Request } from "./request";
import {
    TransferConstructor,
    Transfer,
} from "./transfer";

/**
 * Interface for Client implementations.
 *
 * `Client` implementations can use this in an `implements` clause to verify
 * that they provide the structural basics for a `Client` implementation.
 *
 * This interface does not include incidental but public properties defined in
 * `ClientBase` and should be more stable.
 */
export interface Client {
    transfer(request: Request): Transfer;
    send(request: Request): Transfer;
}

/**
 * Base for Client implementations.
 *
 * This is not named Client because it is not usable as-is. For that, you need
 * a Client implementation from one of the flavors.
 *
 * Since the Transfer implementation is usually where most of the action
 * happens, the Client subclass basically just provides an interface for the
 * end user.
 */
export class ClientBase implements Client {
    /**
     * Constructor invoked to make `Transfer` objects compatible with this
     * `Client`.
     *
     * Client implementations subclassing `ClientBase` can override this
     * property to specify which `Transfer` implementation they want to use.
     * Then the superclass `transfer()` method should usually work as-is.
     *
     */
    public readonly Transfer: TransferConstructor;

    /**
     * Construct a `Client` instance given a `Transfer` constructor.
     */
    constructor (Transfer: TransferConstructor) {
        this.Transfer = Transfer;
    }

    /**
     * Create a `Transfer` representing performance of the given `Request`.
     *
     * This method does not start the transfer, and is suitable for uses where
     * you need to ensure that certain things are done *after* the `Transfer`
     * is created, but *before* it is started.
     */
    public transfer(request: Request): Transfer {
        const transfer = new this.Transfer(request);
        return transfer;
    }

    /**
     * Create and start a `Transfer` performing the given `Request`.
     *
     * This method is what you normally want to use if you just want to run an
     * HTTP request in one shot.
     */
    public send(request: Request): Transfer {
        const transfer = this.transfer(request);
        // If we use the promise interface, we shouldn't need to start(),
        // but it doesn't hurt anything since it's idempotent,
        // and it is needed by people who aren't going to use the promise
        transfer.start();
        return transfer;
    }
}

/**
 * Type for Client implementations.
 */
export interface ClientConstructor {
    new (): Client;
}
