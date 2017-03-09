/**
 * Generic entry point for use from places other than the browser.
 *
 * This module is referenced by the `"main"` property in `package.json`.
 * It is also a convenient place to import high-level public API from.
 */

/** This line does nothing but make typedoc render the module comment. */

import { Request } from "./request";
import { Response } from "./response";
import { Headers } from "./headers";
import { Query } from "./query";

import { Transfer, TransferBase } from "./transfer";
// TODO: import the node client here, right?
import { NodeClient as Client } from "./flavors/node_es5";
import { Frontend } from "./frontend";
import { hosts } from "./hosts";

// The Because class "ships" with everything loaded on it
import { FrontendClass } from "./service_frontend";
import { TokenFrontend } from "./services/token/frontend";
import { RoutingFrontend } from "./services/routing/frontend";
import { BasemapFrontend } from "./services/basemap/frontend";
import { GeocodingFrontend } from "./services/geocoding/frontend";


class Because extends Frontend {
    constructor (env: string, debug?: boolean) {
        const url = hosts[env || "test"];
        const client = new Client();
        const classes: {[name: string]: FrontendClass} = {
            "tokens": TokenFrontend,
            "routing": RoutingFrontend,
            "geocode": GeocodingFrontend,
            "basemap": BasemapFrontend,
        };
        super(classes, new Client(), url, debug);
    }
}

export {
    Request,
    Response,
    Headers,
    Query,
    Transfer,
};
