import { Client } from "../../client";
import { Host } from "../../host";
import { Query } from "../../query";
import { Username, Password, LoginError } from "../../auth";
import { ServiceFrontend } from "../../service_frontend";
import { TokenService } from "./service";
import { response_to_jwt } from "./parse";
import { Frontend } from "../../frontend";


export class TokenFrontend extends ServiceFrontend {
    service: TokenService;

    constructor (frontend: Frontend, host: Host) {
        const service = new TokenService();
        super(service, frontend, host);
    }

    /**
     * Get a token and return it without other side effects.
     */
    async get_token(username: Username, password: Password) {
        // If Javascript consumers pass null values, don't propagate them.
        if (!username) {
            throw new LoginError("username is required");
        }
        if (!password) {
            throw new LoginError("password is required");
        }
        // TODO: query construction should happen in the ServiceFrontend or the
        // Service.
        const query = new Query({
            "username": username as string,
            "password": password as string,
        });
        const response = await this.get("token", query);
        return response_to_jwt(response);
    }

    /**
     * (We usually already have the roles...)
     */
    async get_roles() {
        // TODO
        // const uri = "/token/entitlements";
        // const frontend = this.frontends.tokens;
        // const response = await frontend.entitlements();
        // return parse_entitlements(response);
    }

    // https://github.com/boundlessgeo/bcs/blob/master/bcs-token-service
    // /src/main/java/com/boundlessgeo/bcs/data/ApiKeyResponse.java
    // class ApiKeyData {
    //     key: string;
    //     domain: string;
    //     issued: Datetime;
    //     expires: Datetime;
    // }

    // ref OAuthTokenResponse in
    // https://github.com/boundlessgeo/bcs/blob/master/bcs-token-service
    // /src/main/java/com/boundlessgeo/bcs/data/OAuthTokenResponse.java
    // class OAuthTokenData {
        // access_token: string;
        // token_type: string;
        // expires_in: number;
    // }

    // ref TokenRequest in
    // https://github.com/boundlessgeo/bcs/blob/master/bcs-token-service
    // /src/main/java/com/boundlessgeo/bcs/data/TokenRequest.java
    // class TokenRequest {
        // username: string;
        // password: string;
    // }

    async get_apikey() {
        // TODO
        // const uri = "/token/apikey";
    }

    async get_oauth(username: Username, password: Password) {
        // const uri = "/token/oauth";
    }

}
