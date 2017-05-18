import { Frontend } from "../../frontend";
import { Query } from "../../query";
import { Host } from "../../host";
import { ServiceFrontend } from "../../service_frontend";
import { SearchService } from "./service";
import {
    parse_search_results,
    parse_search_categories,
} from "./parse";


export class SearchFrontend extends ServiceFrontend {
    service: SearchService;

    constructor (frontend: Frontend, host: Host) {
        const service = new SearchService();
        super(service, frontend, host);
    }

    async search(
        // endpoint doesn't require this but we do, because why
        text: string,
        categories: string[] = ["ALL"],
        results_per_page: number = 20,
        starting_page: number = 0,
    ) {
        // this doesn't need a login (yet?)
        // await this.need_login();
        const endpoint = this.service.endpoint("search");
        const cat = categories.join(",");
        const request = endpoint.request(this.host.url, {
            "text": text,
            "cat": cat,
            "results_per_page": results_per_page,
            "starting_page": starting_page,
        });
        const response = await this.send(request);
        return parse_search_results(response);
    }

    async search_data() {
        // this doesn't need a login (yet?)
        // await this.need_login();
        const endpoint = this.service.endpoint("search_data");
        const request = endpoint.request(this.host.url, {});
        const response = await this.send(request);
        return parse_search_results(response);
    }

    async get_categories() {
        const endpoint = this.service.endpoint("categories");
        const request = endpoint.request(this.host.url, {});
        const response = await this.send(request);
        return parse_search_categories(response);
    }

    async search_in_category(category: string, q: string) {
        // this doesn't need a login (yet?)
        // await this.need_login();
        const endpoint = this.service.endpoint("search_in_category");
        const request = endpoint.request(this.host.url, {
            "category": category,
            "q": q,
        });
        const response = await this.send(request);
        return parse_search_results(response);
    }
}
