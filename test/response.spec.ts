import { assert } from "chai";
import { Response } from "../src/response";
import { Headers } from "../src/headers";


describe("Response", () => {

    let response: Response;
    const status = 500;
    const headers = {"a": "b"};
    const body = "foo";

    beforeEach(() => {
        response = new Response(status, headers, body);
    });

    describe("constructor", () => {
        it("accepts an existing Headers object", () => {
            const headers = new Headers();
            const response = new Response(status, headers, body);
        });
    });

    it("copes with unspecified headers", () => {
        const response = new Response(status, undefined, body);
    });

    it("copes with unspecified body", () => {
        const response = new Response(status, headers, undefined);
    });

    it("exposes status", () => {
        assert(response.status === status);
    });

    it("exposes headers", () => {
        assert(response.headers.length === 1);
    });

    it("exposes body", () => {
        assert(response.body === body);
    });

});
