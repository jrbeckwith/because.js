import { Frontend } from "../../frontend";
import { Query } from "../../query";
import { Host } from "../../host";
import { ServiceFrontend } from "../../service_frontend";
import { SearchService } from "./service";
import { parse_search_results } from "./parse";


export class SearchFrontend extends ServiceFrontend {
    service: SearchService;

    constructor (frontend: Frontend, host: Host) {
        const service = new SearchService();
        super(service, frontend, host);
    }

    async search() {
        const endpoint = this.service.endpoint("search");
        const request = endpoint.request(this.host.url, {});
        const response = await this.send(request);
        return parse_search_results(response);
    }

    async search_data() {
        const endpoint = this.service.endpoint("search_data");
        const request = endpoint.request(this.host.url, {});
        const response = await this.send(request);
        return parse_search_results(response);
    }

    async get_search_categories() {
        const endpoint = this.service.endpoint("get_search_categories");
        const request = endpoint.request(this.host.url, {});
        const response = await this.send(request);
        return response;
    }

    async search_in_category(category: string, q: string) {
        const endpoint = this.service.endpoint("search_in_category");
        const request = endpoint.request(this.host.url, {
            "category": category,
            "q": q,
        });
        const response = await this.send(request);
        return response;
    }
}
