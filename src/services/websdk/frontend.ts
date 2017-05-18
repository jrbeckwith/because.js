import { Frontend } from "../../frontend";
import { Host } from "../../host";
import { ServiceFrontend } from "../../service_frontend";
import { WebSDKService } from "./service";
import { parse } from "./parse";


export class WebSDKFrontend extends ServiceFrontend {
    service: WebSDKService;

    constructor (frontend: Frontend, host: Host) {
        const service = new WebSDKService();
        super(service, frontend, host);
    }

    async something() {
        // await this.need_login();
        const endpoint = this.service.endpoint("metadata");
        const request = endpoint.request(this.host.url);
        const response = await this.send(request);
        // TODO parse
        return response;
    }
}
