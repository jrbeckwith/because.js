import { assert } from "chai";
import { InvalidObject } from "../src/errors";


describe("InvalidObject", () => {
    it("can be thrown", () => {
        const message = "I do not like this";
        try {
            throw new InvalidObject(message);
        }
        catch (error) {
            assert(error.message === message);
        }
    });
});
