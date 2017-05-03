import { assert } from "chai";
import { Request, InvalidRequest } from "../src/request";
import { Data } from "../src/data";
import { Query } from "../src/query";
import { Headers } from "../src/headers";


describe("Request", () => {

    let request: Request;
    const method = "GET";
    const url = "http://example.com";
    const query = new Query({});
    const headers = new Headers({});
    const body = "";

    beforeEach(() => {
        request = new Request(method, url, query, body, headers);
    });

    describe("constructor", () => {
        it("throws InvalidRequest for querystring in url", () => {
            assert.throws(
                () => {
                    const url = "http://example.com/?das_ist_verboten";
                    const request = new Request(
                        method, url, query, body, headers,
                    );
                },
                InvalidRequest,
            );
        });

        it("does not choke on undefined query", () => {
            const query: undefined = undefined;
            const request = new Request(method, url, query, body, headers);
        });

        it("does not choke on undefined headers", () => {
            const headers: undefined = undefined;
            const request = new Request(method, url, query, body, headers);
        });

        it("takes a Query instance if provided", () => {
            const query = new Query({"a": "b"});
            const request = new Request(method, url, query, body, headers);
            assert(request.query.get("a") === "b");
        });

        it("takes a Headers instance if provided", () => {
            const headers = new Headers({"a": "b"});
            const request = new Request(method, url, query, body, headers);
            assert(request.headers.get("a") === "b");
        });
    });

    it("exposes method", () => {
        assert(request.method === method);
    });

    describe("url", () => {
        it("exposes url", () => {
            assert(request.url === url);
        });

        it("encodes the query string for you", () => {
            const query = new Query({"a": "b"});
            const request = new Request(
                method, url, query, body, headers,
            );
            const expected = "http://example.com?a=b";
            assert(request.url === expected);
        });

    });

    it("exposes query", () => {
        assert(request.query);
        assert(request.query.equals(new Query()));
    });

    it("exposes headers", () => {
        assert(request.headers);
        assert(request.headers.equals(new Headers()));
    });

    it("exposes body", () => {
        assert(request.body === body);
    });

});

