import { Endpoint } from "../../service";


export const endpoints = {

    // bcs/bcs-geocoding/bcs-geocoding-service/src/main/java/com/boundlessgeo
    // /bcs/geocoding/service/
    // GeocodingService.java
    //
    // bcs/bcs-geocoding/bcs-geocoding-model/src/main/java/com/boundlessgeo/bcs
    // /geocoding/provider/Geocoding.java
    "metadata": new Endpoint(
        "GET", "/geocodings",
    ),

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
