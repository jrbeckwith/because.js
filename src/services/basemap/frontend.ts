import { Frontend } from "../../frontend";
import { Host } from "../../host";
import { ServiceFrontend } from "../../service_frontend";
import { BasemapService } from "./service";
import { parse_basemaps } from "./parse";


export class BasemapFrontend extends ServiceFrontend {
    service: BasemapService;

    constructor (frontend: Frontend, host: Host) {
        const service = new BasemapService();
        super(service, frontend, host);
    }

    /**
     * Get a list of basemaps.
     */
    async basemaps() {
        // TODO: does this need login?
        // await this.need_login();
        const uri = `/basemaps/`;
        const request = this.request("GET", uri);
        const response = await this.send(request);
        return parse_basemaps(response);
    }
}
