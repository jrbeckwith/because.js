import { JWTData } from "./parse";


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
        const roles = this.data.app_metadata.SiteRole.split(",");
        roles.sort();
        return roles;
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


