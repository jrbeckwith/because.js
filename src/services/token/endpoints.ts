import { Query } from "../../query";
import { Headers } from "../../headers";
import { Endpoint } from "../../service";


export const endpoints = {
    "get_token": new Endpoint(
        "POST",
        "/token/",
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

    "get_roles": new Endpoint(
        "GET",
        "/token/entitlements",
    ),

    "get_apikey": new Endpoint(
        "GET",
        "/token/apikey",
    ),

    "manage": new Endpoint(
        "GET", "/token/manage",
    ),
};
