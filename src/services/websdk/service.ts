import { Service } from "../../service";
import { endpoints } from "./endpoints";


/**
 * HTTP interface definition for basemaps service.
 */
export class WebSDKService extends Service {

    constructor () {
        super(endpoints);
    }

    parse(response: Response) {
    }
}
