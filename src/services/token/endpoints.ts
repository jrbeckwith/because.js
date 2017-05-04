import { Query } from "../../query";
import { Headers } from "../../headers";
import { Endpoint } from "../../service";


export const endpoints = {
    "get_token": new Endpoint(
        // I think there's also a GET but no reason to use it here.
        "POST", "/token/",
        new Query(),
        new Headers({
            "Content-Type": "application/json",
        }),
        (args) => {
            return JSON.stringify({
                "username": args.username.toString(),
                "password": args.password.toString(),
            });
        },
    ),

    "get_oauth_token": new Endpoint(
        "POST": "/token/oauth",
        undefined,
        undefined,
        (args) => {
            return JSON.stringify({
                "grant_type": "password",
                "username": args.username,
                "password": args.password,
            });
        },
    ),

    // bcs/bcs-token-service/src/main/java/com/boundlessgeo/bcs/services/
    // TokenService.java
    "get_roles": new Endpoint(
        "GET", "/token/entitlements",
    ),

    "get_apikey": new Endpoint(
        "GET", "/token/apikey",
    ),

    "manage": new Endpoint(
        "GET", "/token/manage",
    ),
};
