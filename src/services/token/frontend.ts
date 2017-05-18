import { Client } from "../../client";
import { Host } from "../../host";
import { Query } from "../../query";
import { Username, Password } from "../../auth";
import { ServiceFrontend } from "../../service_frontend";
import { TokenService } from "./service";
import { response_to_jwt } from "./parse";
import { Frontend } from "../../frontend";


/**
 * Error class that can be thrown when there was a problem logging in.
 */
export class LoginError extends BecauseError {
}


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

        const endpoint = this.service.endpoint("get_token");
        const request = endpoint.request(this.host.url, {
            "username": username as string,
            "password": password as string,
        });
        const response = await this.send(request);
        return response_to_jwt(response);
    }

    /**
     * (We usually already have the roles...)
     */
    async get_roles() {
        const endpoint = this.service.endpoint("get_roles");
        const request = endpoint.request(this.host.url, {});
        const response = await this.send(request);
        // TODO
        // return parse_entitlements(response);
        return response;
    }

    async get_apikey() {
        // TODO
    }

    async get_oauth(username: Username, password: Password) {
        // const uri = "/token/oauth";
    }

}
