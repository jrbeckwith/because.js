import { Service, Endpoint } from "../service";

// TODO: unify with the JWT stuff

/**
 * Definition for token service.
 */
export class TokenService extends Service {

    constructor () {
        const data = {
            "token": new Endpoint(
                "/token/",
                ["POST"],
            ),
        };
        super(data);
    }

    parse(response: Response) {
    }
}
