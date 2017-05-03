import { Query } from "../../query";
import { Endpoint } from "../../service";


class SearchArgs {
    text: string;
    categories: string[];
    results_per_page: number;
    starting_page: number;
}


// These should normally be pulled from the search endpoint
const DEFAULT_CATEGORIES = [
    "LC",
    "DOC",
    "VID",
    "BLOG",
    "QA",
    "DIS",
    "PLUG",
];


// bcs/bcs-search-service/README.md
export const endpoints = {

    "search": new Endpoint(
        "GET",
        "/search/",
        // TODO: not really happy with the untyped interface here... :/
        (args) => {
            return new Query({
                "q": (args.text || "").toString(),
                "cat": (args.categories || "ALL").toString(),
                "c": (args.results_per_page || 20).toString(),
                "si": (args.starting_page || 0).toString(),
            });
        },
    ),

    "search_data": new Endpoint(
        "GET",
        "/search/data/",
    ),

    // NativeSearchServiceTest.java nativeSearchCategory()
    "categories": new Endpoint(
        "GET",
        "/search/categories/",
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
