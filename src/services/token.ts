import { Response, parse_response } from "./response";

/**
 * Structure of JSON body of token responses.
 */
export class TokenData {
    token: string;
    errorCode: number | undefined;
    errorMessage: string | undefined;
}


class ParseError extends Error {}


// Structure of object under 'app_metadata' in a parsed JWT.
export class AppMetadata {
    SiteRole: string;
}


// Structure of a parsed JWT.
export class JWTData {
    name: string;
    email: string;
    email_verified: boolean;
    app_metadata: AppMetadata;
    iss: string;
    sub: string;
    aud: string;
    exp: number;
    iat: number;

    // Not in the actual response, but added by parser for convenience
    token: string | undefined;
}


/**
 * Extract a token blob from a response.
 *
 * This does not parse any of the JWT structure implicit in the blob.
 */
export function response_to_blob(response: Response): string {
    const data = parse_response<TokenData>(response);
    if (!data.token) {
        throw new Error("no token blob");
    }
    return data.token;
}

/**
 * Extract JWT metadata from the given blob.
 */
export function blob_to_data(blob: string): JWTData {
    if (!blob) {
        throw new Error("empty token blob");
    }
    const parts = blob.split(".");
    if (parts.length !== 3) {
        throw new Error("cannot parse token blob into parts");
    }
    const middle = parts[1];
    // TODO: Node compatibility here...
    const payload = window.atob(middle);
    const parsed = JSON.parse(payload);
    return parsed;
}

/**
 * Extract JWT metadata from the given response.
 *
 * This means what you get back is a lower-level object directly reflecting the
 * JSON that was base64 encoded.
 */
export function response_to_data(response: Response): JWTData {
    const blob = response_to_blob(response);
    const data = blob_to_data(blob);
    // Add the token in case caller doesn't have it
    return {...data, "token": data.token || ""};
}


/**
 * Extract a JWT object from the given response.
 *
 * This means what you get back is a higher-level object that's easier for
 * humans to read and write programs against.
 */
export function response_to_jwt(response: Response): JWT {
    const blob = response_to_blob(response);
    const data = blob_to_data(blob);
    // Use LazyJWT to parse this, so I don't have to duplicate the parsing
    // methods right now. But return a nice browsable JWT.
    const lazy = new LazyJWT(data);
    return new JWT(
        lazy.name,
        lazy.email,
        lazy.email_verified,
        lazy.roles,
        lazy.issuer,
        lazy.subject,
        lazy.audience,
        lazy.expiration,
        lazy.issued_at,
        blob,
    );
}


export class JWT {
    // This is way too big, but what can you do
    // Everything is preparsed so the object is pretty to browse

    constructor (
        // User name. Probably the same as email in our case.
        public name: string,

        // Email address.
        public email: string,

        // Is the email address verified?
        public email_verified: boolean,

        // List of role strings. Derived from app_metadata.SiteRole
        public roles: string[],

        // Identify the principal that issued the JWT <- "iss"
        public issuer: string,

        // Principal that the JWT is about. <- "sub"
        public subject: string,

        // Intended recipients for the JWT. <- "aud"
        public audience: string,

        // Time the JWT expires. <- "exp"
        public expiration: Date,

        // Time the JWT was issued. <- "iat"
        public issued_at: Date,

        // Retained copy of the whole token blob, in its unparsed form
        public token: string,
    ) {
    }
}


/**
 * Parses on demand, less pretty to browser
 */
export class LazyJWT implements JWT {

    constructor (private data: JWTData) {
    }

    get name() {
        return this.data.name;
    }

    get email() {
        return this.data.email;
    }

    get email_verified() {
        return this.data.email_verified;
    }

    get roles() {
        return this.data.app_metadata.SiteRole.split(",");
    }

    get issuer() {
        return this.data.iss;
    }

    get subject() {
        return this.data.sub;
    }

    get audience() {
        return this.data.aud;
    }

    get expiration() {
        return new Date(this.data.exp * 1000);
    }

    get issued_at() {
        return new Date(this.data.iat * 1000);
    }

    get token() {
        return this.data.token || "";
    }

}
