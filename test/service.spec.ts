import { assert } from "chai";
import { Query } from "../src/query";
import { Headers } from "../src/headers";
import { Service } from "../src/service";
import { Endpoint, Args } from "../src/service";


describe("Service", () => {

    beforeEach(() => {
    });

    describe("constructor", () => {
        it("", () => {
        });
    });

    it("", () => {
    });

    describe("url", () => {
        it("", () => {
        });

    });

});



describe("Endpoint", () => {

    describe("query", () => {

        it("defaults to empty query", () => {
            const endpoint = new Endpoint("GET", "/x{x}/z{z}");
            const query = endpoint.query();
            assert(query.equals(new Query()));
        });

        it("works with constant query", () => {
            const query: Query = new Query({"whee": "woo"});
            const endpoint = new Endpoint(
                "GET",
                "/x{x}/z{z}",
                query,
                new Headers(),
            );
            const result = endpoint.query();
            assert(result !== query);
            assert(result.get("whee") === "woo");
        });

        it("works with a query function", () => {
            const endpoint = new Endpoint(
                "GET",
                "/x{x}/z{z}",
                (args) => {
                    return new Query({"x": "6"});
                },
                new Headers(),
            );
            const query = endpoint.query();
            assert(query.get("x") === "6");
        });
    });

    describe("headers", () => {

        it("defaults to empty headers", () => {
            const endpoint = new Endpoint("GET", "/x{x}/z{z}");
            const headers = endpoint.headers();
            assert(headers.equals(new Headers()));
        });

        it("works with constant headers", () => {
            const headers = new Headers({"whee": "woo"});
            const endpoint = new Endpoint(
                "GET",
                "/x{x}/z{z}",
                new Query(),
                headers,
            );
            const result = endpoint.headers();
            assert(result !== headers);
            assert(result.get("whee") === "woo");
        });

        it("works with a headers function", () => {
            const endpoint = new Endpoint(
                "GET",
                "/x{x}/z{z}",
                new Query(),
                (args) => {
                    return new Headers({"x": "6"});
                },
            );
            const headers = endpoint.headers();
            assert(headers.get("x") === "6");
        });
    });

    describe("body", () => {
        it("defaults to empty body", () => {
            const endpoint = new Endpoint("GET", "/x{x}/z{z}");
            assert(endpoint.body() === "");
        });

        it("works with a constant body", () => {
            const endpoint = new Endpoint(
                "GET",
                "/x{x}/z{z}",
                new Query(),
                new Headers(),
                "Foozle",
            );
            const result = endpoint.body();
            assert(result === "Foozle");
        });

        it("works with a body function", () => {
            const endpoint = new Endpoint(
                "GET",
                "/x{x}/z{z}",
                new Query(),
                new Headers(),
                (args) => {
                    return "Foozle" + args["x"];
                },
            );
            const result = endpoint.body({"x": 7});
            assert(result === "Foozle7");
        });
    });

    describe("uri", () => {
        it("passes a simple smoke test", () => {
            const endpoint = new Endpoint("GET", "/x{x}/z{z}");
            const args: Args = {"x": "y", "z": "3"} as Args;
            const uri = endpoint.uri(args);
            assert(uri === "/xy/z3");
        });

        it("inlines the query when asked", () => {
            const endpoint = new Endpoint(
                "GET",
                "/x{x}/z{z}",
                new Query({"q": "2", "m": "xyz"}),
            );
            const args: Args = {"x": "y", "z": 3} as Args;
            const uri = endpoint.uri(args, true);
            assert(uri === "/xy/z3?q=2&m=xyz");
        });

        it("accepts and converts numeric arguments", () => {
            const endpoint = new Endpoint(
                "GET",
                "/x{x}/y{y}",
            );
            const args = {"x": 2, "y": 3} as Args;
            const uri = endpoint.uri(args);
            assert(uri === "/x2/y3");
        });

    });

    describe("url", () => {
        it("rejects a malformed base URL", () => {
            const endpoint = new Endpoint("GET", "/x{x}/z{z}");
            const base = "https//www.example.com/";
            assert.throws(() => { endpoint.url(base); }, Error);
        });

        it("concatenates a base with a uri() result", () => {
            const endpoint = new Endpoint("GET", "/x{x}/z{z}");
            const args: Args = {"x": "y", "z": 3} as Args;
            const uri = endpoint.uri(args);
            const base = "https://example.com";
            const url = endpoint.url(base, args);
            assert(url === base + uri);
        });

        it("handles redundant slashes in the join", () => {
            const endpoint = new Endpoint("GET", "//////x{x}/z{z}");
            const args: Args = {"x": "y", "z": "3"} as Args;
            const base = "https://example.com//////";
            const url = endpoint.url(base, args);
            assert(url === "https://example.com/xy/z3");
        });

    });

    describe("request", () => {
        it("passes a smoke test", () => {
            const query = new Query({"q": "2", "m": "xyz"});
            const headers = new Headers({"whee": "woo"});
            const body = "Foozle";
            const endpoint = new Endpoint(
                "GET",
                "/x{x}/z{z}",
                query,
                headers,
                body,
            );
            const args: Args = {"x": "y", "z": "3"} as Args;
            const request = endpoint.request("https://example.com", args);
            assert(request.method === "GET");
            assert(request.url === "https://example.com/xy/z3?q=2&m=xyz");
            assert(request.query !== query);
            assert(request.query.equals(query));
            assert(request.headers !== headers);
            assert(request.headers.equals(headers));
            assert(request.body === body);
        });
    });


});

