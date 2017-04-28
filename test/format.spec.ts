import { assert } from "chai";
import {
    format,
} from "../src/format";


describe("format()", () => {

    it("passes through a template with no placeholders", () => {
        assert(format("foo bar") === "foo bar");
    });

    it("works with just a placeholder", () => {
        const result = format("{xyz}", {"xyz": "abc"});
        assert(result === "abc");
    });

    it("works with placeholder as prefix", () => {
        const result = format("{xyz}DEF", {"xyz": "abc"});
        assert(result === "abcDEF");
    });

    it("works with placeholder as suffix", () => {
        const result = format("DEF{xyz}", {"xyz": "abc"});
        assert(result === "DEFabc");
    });

    it("works with placeholder in the middle", () => {
        const result = format("ABC{xyz}DEF", {"xyz": "abc"});
        assert(result === "ABCabcDEF");
    });

    it("gives empty string for missing data", () => {
        const result = format("A{x}B")
        assert(result === "AB");
    });

    it("gives empty string for missing keys", () => {
        const result = format("A{x}B", {})
        assert(result === "AB");
    });

    it("ignores extra keys", () => {
        const result = format("A{x}B", {"y": "m"})
        assert(result === "AB");
    });

});
