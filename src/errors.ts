/**
 * Error types for internal use.
 *
 */

/** This line does nothing but make typedoc render the module comment. */


export class BecauseError implements Error {
    readonly name: string = "BecauseError";
    readonly message: string;

    /**
     * @param message       As Error message.
     */
    constructor (message: string) {
        this.message = message;
    }
}


/**
 * Error thrown by constructors when an invalid object would be created.
 *
 * This causes any assignment to the new object to fail, ensuring that no
 * object with an invalid state is ever available for use.
 *
 * It would usually be polite to users, when writing new modules that need to
 * use this, to make your own subclass and use that instead of directly
 * throwing this.
 */
export class InvalidObject extends BecauseError {
    readonly name: string = "InvalidObject";
}

/**
 * Thrown by parsing routines when their expectations are violated so that they
 * cannot return a reasonable result.
 * This differs from InvalidObject in that it pertains to the parsing side, not
 * semantic validation in constructors to prevent invalid states.
 */
export class ParseError extends BecauseError {
}
