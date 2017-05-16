import { Query } from "../../query";
import { Endpoint } from "../../service";


class SearchArgs {
    text: string;
    categories: string[];
    results_per_page: number;
    starting_page: number;
}


// bcs/bcs-search-service/README.md
export const endpoints = {

    // bcs-search-service/src/main/java/com/boundlessgeo/bcs/services/
    // NativeSearchService.java
    "search": new Endpoint(
        "GET", "/search/",
        // TODO: not really happy with the untyped interface here... :/
        (args) => {
            return new Query({
                "q": (args.text || "").toString(),
                "cat": (args.cat || "ALL").toString(),
                "c": (args.results_per_page || 20).toString(),
                "si": (args.starting_page || 0).toString(),
            });
        },
    ),

    // bcs/bcs-search-service/src/main/java/com/boundlessgeo/bcs/services/
    // OpenSearchService.java
    "search_open": new Endpoint(
        "GET", "/search/open",
        (args) => {
            return new Query({
                "q": (args.text || "").toString(),
                "cat": (args.cat || "ALL").toString(),
                "c": (args.results_per_page || 20).toString(),
                "si": (args.starting_page || 0).toString(),
            });
        },
    ),

    // bcs/bcs-search-service/src/main/java/com/boundlessgeo/bcs/services/
    // DataSearchService.java
    // bcs/bcs-search-service/src/main/java/com/boundlessgeo/bcs/data/
    // SpatialDataQuery.java
    "search_data": new Endpoint(
        "GET", "/search/data/",
        // assuming this takes GET, probably query parameters
        (args) => {
            return new Query({
                "startPeriod": args.start.toString(),
                "endPeriod": args.end.toString(),
                "searchBounds": args.bounds.toString(),
                "terms": args.terms.toString(),
            });
        },
    ),

    // NativeSearchServiceTest.java nativeSearchCategory()
    "categories": new Endpoint(
        "GET", "/search/categories/",
    ),

    // TODO: really no point in using this, is there?
    // NativeSearchServiceTest.java nativeSearchCategory()
    "search_in_category": new Endpoint(
        "GET",
        "/search/categories/{category}",
        (args) => {
            let q = args.q;
            // stupid typescript needs help here
            if (typeof q === "number") {
                q = "";
            }
            return new Query({
                "q": q,
            });
        },
    ),

    "manage": new Endpoint(
        "GET", "/search/manage",
    ),
};
