import { BecauseError } from "../../errors";
import { Response } from "../../response";
import { parse_response } from "../../parse";
import { JWT, LazyJWT } from "./jwt";


class TokenParseError extends BecauseError {
}


// https://github.com/boundlessgeo/bcs/blob/master/bcs-token-service
// /src/main/java/com/boundlessgeo/bcs/data/ApiKeyResponse.java
class ApiKeyData {
    key: string;
    domain: string;
    issued: Date;
    expires: Date;
}

// ref OAuthTokenResponse in
// https://github.com/boundlessgeo/bcs/blob/master/bcs-token-service
// /src/main/java/com/boundlessgeo/bcs/data/OAuthTokenResponse.java
class OAuthTokenData {
    access_token: string;
    token_type: string;
    expires_in: number;
}

// ref TokenRequest in
// https://github.com/boundlessgeo/bcs/blob/master/bcs-token-service
// /src/main/java/com/boundlessgeo/bcs/data/TokenRequest.java
class TokenRequest {
    username: string;
    password: string;
}

/**
 * Structure of JSON body of token responses.
 *
 * See also:
 * https://github.com/boundlessgeo/bcs/blob/master/bcs-token-service
 * /src/main/java/com/boundlessgeo/bcs/data/BCSToken.java
 */
export class TokenData {
    token: string;
    errorCode: number | undefined;
    errorMessage: string | undefined;
}

/**
 * Structure of object under 'app_metadata' in a parsed JWT.
 */
export class AppMetadata {
    SiteRole: string;
}

/**
 * Structure of a JWT, after the base64 blob is parsed.
 */
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
