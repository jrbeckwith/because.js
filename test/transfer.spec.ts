import { assert } from "chai";
import { TransferBase } from "../src/transfer";
import { Request } from "../src/request";


describe("TransferBase", () => {

    let transfer: TransferBase;
    let request: Request;

    beforeEach(() => {
        request = new Request(
            // method
            "GET",
            // url
            "http://example.com",
            // body
            "body stuff here",
            // query
            {},
            // headers
            {},
        );
        transfer = new TransferBase(request);
    });

    describe("constructor", () => {
        it("exposes the given request", () => {
            assert(transfer.request.equals(request));
        });
    });

    describe("start", () => {
        it("runs without throwing", () => {
            transfer.start();
        });
    });

    describe("abort", () => {
        it("runs without throwing", () => {
            transfer.abort();
        });
    });

    describe("cause", () => {
        it("can be retrieved", () => {
            // Cannot set it directly, since it is protected...
            class Transfer extends TransferBase {
                abort() {
                    this.finish("yodeling");
                }
            }
            const transfer = new Transfer(request);
            assert(transfer.cause === "");
            transfer.abort();
            assert(transfer.cause === "yodeling");
        });
    });

});
