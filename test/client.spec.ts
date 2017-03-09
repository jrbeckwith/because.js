import { assert } from "chai";
import { Data } from "../src/data";
import { ClientBase } from "../src/client";
import { Request } from "../src/request";
import { Transfer, TransferBase } from "../src/transfer";


describe("ClientBase", () => {

    let client: ClientBase;
    const request: Request = new Request(
        // method
        "GET",
        // url
        "http://example.com",
        // body
        "",
        // query
        {},
        // headers
        {},
    );

    beforeEach(() => {
        client = new ClientBase(TransferBase);
    });

    describe("send()", () => {
        it("creates and starts a transfer, then returns it", () => {
            const transfer = client.send(request);
            assert(transfer.started);
        });
    });

    describe(".transfer()", () => {
        it("makes a Transfer with the given request", () => {
            const transfer = client.transfer(request);
            assert(transfer instanceof TransferBase);
            assert(transfer.request.equals(request));
        });
    });

});
