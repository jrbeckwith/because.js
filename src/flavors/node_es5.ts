/**
 * Implementation targeting ES5 on Node.
 */

/** This line does nothing but make typedoc render the module comment. */

import { Request, Response } from "../index";
import { ClientBase } from "../client";
import { TransferBase } from "../transfer";
import * as http from "http";
import * as url from "url";
import * as net from "net";


/**
 * Transfer implementation for node_es5.
 */
export class NodeTransfer extends TransferBase {
    private chunks: string[] = [];
    private node_request: http.ClientRequest;

    public async promise(): Promise<Response> {
        // super.promise();
        const parsed = url.parse(this.request.url);
        const base = 10;
        const port = parseInt(parsed.port || "80", base);
        let path = parsed.pathname;
        const query_string = this.request.query.encoded;
        if (query_string) {
            path += query_string;
        }
        const options = {
            "method": this.request.method,
            "protocol": parsed.protocol,
            "host": parsed.hostname,
            "port": port,
            "path": path,
            "headers": this.request.headers.data(),
        };
        const request = http.request(
            options,
            (response: http.IncomingMessage) => {
                response.on("data", this.chunks.push);
                response.on("end", () => {
                    this.on_finish(response);
                });
            },
        );
        request.write(this.request.body);
        request.end();
        if (typeof this.timeout !== "undefined") {
            request.setTimeout(this.timeout, this.on_timeout);
        }
        this.node_request = request;

        // TODO: await some node thingy
        return new Response(0);
    }

    private on_timeout(socket: net.Socket) {
    }

    public on_finish(response: http.IncomingMessage) {
        for (const chunk of this.chunks) {
        }
        // TODO: mark as done
        // TODO: notify subscriber or whatever
        // TODO: do something with this.chunks list
    }

    public abort() {
        this.node_request.abort();
    }
}


/**
 * Client implementation for node_es5.
 */
export class NodeClient extends ClientBase {
    constructor () {
        super(NodeTransfer);
    }
}
