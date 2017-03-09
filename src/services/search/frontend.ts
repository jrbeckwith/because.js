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
        const uri = `/search/`;
        const query = new Query({});
        const request = this.request("GET", uri, query);
        const response = await this.send(request);
        return parse_search_results(response);
    }

    async search_data() {
        const query = new Query({});
        const uri = "search/data/";
        const response = await this.send(
            this.request("GET", uri, query),
        );
        return parse_search_results(response);
    }

    async get_search_categories() {
        const uri = `search/categories/`;
        const query = new Query({});
        const request = this.request("GET", uri, query);
        const response = await this.send(request);
        return response;
    }

    async search_in_category(category: string, q: string) {
        const uri = `search/categories/${category}`;
        const query = new Query({"q": q});
        const request = this.request("GET", uri, query);
        const response = await this.send(request);
        return response;
        // return parse_search_categories(response);
    }
}
