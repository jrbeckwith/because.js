import { Endpoint } from "../../service";


export const endpoints = {

    // bcs/docs/services/basemap.md

    "basemaps": new Endpoint(
        // * Trailing slash is needed if security header is not set
        "GET", "/basemaps/",
    ),

    //  bcs/bcs-basemap-service/src/main/java/com/boundlessgeo/bcs/basemap/
    //  services/ProviderService.java
    "providers": new Endpoint(
        "GET", "/basemaps/providers",
    ),

    "provider": new Endpoint(
        "GET", "/basemaps/providers/{provider}",
    ),

    "manage": new Endpoint(
        "GET", "/basemaps/manage",
    ),
};
