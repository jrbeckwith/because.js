/**
 * This file defines some simple types for representing data associated with
 * authentication.
 */

/** This line does nothing but make typedoc render the module comment. */

import { BecauseError } from "./errors";


/**
 * Simple type wrapper to help avoid mixing up usernames with other data stored
 * in strings.
 */
export class Username extends String {
}

/**
 * Simple type wrapper to help avoid mixing up passwords with other data stored
 * in strings.
 */
export class Password extends String {
}

/**
 * Simple type for passing around a username and password together.
 */
export class Credentials {
    public username: Username;
    public password: Password;
}

/**
 * Error class that can be thrown when there was a problem logging in.
 */
export class LoginError extends BecauseError {
}
