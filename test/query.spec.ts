import { assert } from "chai";
import { Query } from "../src/query";


describe("Query", () => {

    beforeEach(() => {
    });

    describe("without arguments", () => {
        it("encodes as the null string", () => {
            const query = new Query();
            assert(query.encoded === "");
        });
    });


    describe("with data", () => {
        it("encodes as expected", () => {
            const query = new Query({"a": "b", "x": "y"});
            assert(query.encoded === "a=b&x=y");
        });
    });

});
