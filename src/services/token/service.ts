import { Service, Endpoint } from "../../service";
import { endpoints } from "./endpoints";


/**
 * HTTP interface definition for the token service.
 */
export class TokenService extends Service {

    constructor () {
        super(endpoints);
    }

    parse(response: Response) {
    }
}
