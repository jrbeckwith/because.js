import { Query } from "../../query";
import { Endpoint } from "../../service";


export const endpoints = {

    "search": new Endpoint(
        "GET",
        "/search/",
    ),

    "search_data": new Endpoint(
        "GET",
        "/search/data/",
    ),

    "get_search_categories": new Endpoint(
        "GET",
        "/search/categories/",
    ),

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
