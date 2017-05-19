import { Service } from "./service";
import { Transfer } from "./transfer";
import { Host } from "./host";
import { Request } from "./request";
import { Log } from "./log";
import { Frontend } from "./frontend";

/**
 * Frontend for a specific service.
 *
 * This contains per-service logic that would otherwise be in Frontend.
 * Code that needs to share state across services goes in Frontend
 * instead.
 */
export class ServiceFrontend {
    public service: Service;
    protected _frontend: Frontend;
    public host: Host;
    protected log: Log;

    /**
     * @param service   Service instance to wrap.
     * @param frontend  Frontend to send requests with.
     * @param host      Description of host to send requests to.
     */
    constructor (
        service: Service, frontend: Frontend, host: Host,
    ) {
        this.service = service;
        this._frontend = frontend;
        this.host = host;
        this.log = new Log("ServiceFrontend");
    }

    send(request: Request): Transfer {
        this.log.debug("send", {"request": request});
        return this._frontend.send(request);
    }

    /**
     * Assert that we have a token to log in with.
     *
     * Methods on this class can simplify their implementation by awaiting this
     * to ensure they do not issue any requests without having a token to send.
     *
     * In the future this may be changed to automatically accomplish login if
     * there is a way to do that.
     */
    protected async need_login() {
        const jwt = this._frontend ? this._frontend.jwt : undefined;
        if (!jwt || !jwt.token) {
            throw new Error("not logged in");
        }
        return jwt;
    }
}


export interface FrontendClass {
    new (
        frontend: Frontend,
        host: Host,
    ): ServiceFrontend;
}
