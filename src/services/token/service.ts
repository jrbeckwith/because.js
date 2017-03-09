import { Service, Endpoint } from "../../service";


/**
 * HTTP interface definition for the token service.
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
