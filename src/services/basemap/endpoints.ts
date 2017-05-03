import { Endpoint } from "../../service";


export const endpoints = {

    "metadata": new Endpoint(
        // * Trailing slash is needed if security header is not set
        "GET", "/basemaps/",
    ),

    "manage": new Endpoint(
        "GET", "/basemaps/manage",
    ),
};
