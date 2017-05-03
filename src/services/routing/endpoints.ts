import { Endpoint } from "../../service";
import { Query } from "../../query";


export const endpoints = {
    // JSON list
    //  name: string
    //  description: string
    //  endpoint: string - has originx originy destinationx destinationy in it.
    //  accessList: List[string]
    //  apidoc: URL
    "metadata": new Endpoint(
        "GET", "/routings/",
    ),

    // providers: mapzen, mapbox
    // This looks like the same kind of endpoint provided by /routings/...
    "geocoded": new Endpoint(
        "GET",
        "/route/{provider}\
        /originx/{originx}\
        /originy/{originy}\
        /destinationx/{destinationx}\
        /destinationy/{destinationy}",
    ),

    "address": new Endpoint(
        "GET",
        "/route/{provider}/\
        originaddress/{originaddress}\
        /destinationaddress/{destinationaddress}",
    ),

    // Any number of waypoints of mixed type: either address or (x, y) coords.
    // delimited by urlencoded pipe %7C. All data is in the query string.
    "waypoints": new Endpoint(
        "GET", "/route/{provider}/",
        (args) => {
            const provider = args.provider.toString();
            // TODO: move the serialization stuff here maybe?
            const waypoints = args.waypoints.toString();
            return new Query({
                "provider": provider,
                "waypoints": waypoints,
            });
        },
    ),

    "batch": new Endpoint(
        "GET", "/route/mapbox/batch",
    ),

    "isochrone": new Endpoint(
        // returns a jobid.
        "GET", "/route/{provider}/isochrone",
        (args) => {
            return new Query({
                "provider": args.provider.toString(),
                // longitude of center point of isochrone
                "centerx": args.longitude.toString(),
                // latitude of center point of isochrone
                "centery": args.latitude.toString(),
                // time in seconds
                "time": args.time.toString(),
                // number of seconds between contours
                "resolution": args.resolution.toString(),
                // fatest possible speed allowed in area, kilometers per hour
                "maxspeed": args.maxspeed.toString(),
            });
        },
    ),

    "isochrone_status": new Endpoint(
        // status: "Complete" | "Error"
        // time
        // jobid
        // results: empty for isochrone, populated for batch routing
        // isoresults: geojson FeatureCollection of WGS84 polygons
        //  id property;
        //  level property=drive time from center to this poly's boundary.
        "GET", "/route/{provider}/isochrone/{jobid}",
    ),

    "manage": new Endpoint(
        "GET", "/route/manage",
    ),
};
