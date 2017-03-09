// import { URL } from "../../URL";
// import { Basemap } from "./basemap";
import { Service } from "../../service";
import { endpoints } from "./endpoints";


/**
 * HTTP interface definition for basemaps service.
 */
export class BasemapService extends Service {

    constructor () {
        super(endpoints);
    }

    parse(response: Response) {
    }
}
