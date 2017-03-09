import { assert } from "chai";
import { Headers } from "../src/headers";


describe("Headers", () => {

    const example = {
        "Content-Type": "applicaTion/json",
        "X": "Y",
    };

    beforeEach(() => {
    });

    it("works when the constructor is invoked without arguments", () => {
        const headers = new Headers();
    });

    it("normalizes keys in data passed to the constructor", () => {
        const headers = new Headers({"X": "Y"});
        assert(headers.get("x") === "Y");
        assert(headers.get("X") === "Y");
    });

    describe("length", () => {
        it("works correctly for empty instance", () => {
            const headers = new Headers();
            assert(headers.length === 0);
        });

        it("works correctly for non-empty instance", () => {
            const headers = new Headers(example);
            assert(headers.length === 2);
        });
    });

    describe("get()", () => {
        const headers = new Headers(example);
        it("normalizes keys, but not values", () => {
            assert(headers.get("CoNtEnT-tYpE") === "applicaTion/json");
        });
    });

    describe("set()", () => {
        it("normalizes keys", () => {
            const headers = new Headers();
            headers.set("sMuRf", "freundlich");
            assert(headers.get("smurf") === "freundlich");
        });

        it("accepts and serializes lists", () => {
            const headers = new Headers();
            headers.set("blop", ["Eep", "Oop"]);
            assert(headers.get("blop") === "Eep,Oop");
        });
    });

});
