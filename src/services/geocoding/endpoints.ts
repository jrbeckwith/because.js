import { Endpoint } from "../../service";


export const endpoints = {

    "forward": new Endpoint(
        "GET", "/geocode/{provider}/address/{address}",
    ),

    "reverse": new Endpoint(
        "GET", "/geocode/{provider}/address/x/{x}/y/{y}",
    ),

    "batch": new Endpoint(
        "GET", "/geocode/{provider}/batch",
    ),

    "manage": new Endpoint(
        "GET", "/geocode/manage",
    ),
};
