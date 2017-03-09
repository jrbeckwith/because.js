import { assert } from "chai";
import {
    Data,
    length,
    equals,
    keys,
    values,
    pairs,
    each,
    map,
    copy,
    as_strings,
    as_string,
    arrays_equal,
    pairs_equal,
} from "../src/data";


// what rubbish
interface Len {
    length: number;
}

// ugh
function sorted_equal<T>(a: T[], b: T[]): boolean {
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    const items_a = a.slice();
    const items_b = b.slice();
    items_a.sort();
    items_b.sort();
    return arrays_equal(items_a, items_b);
}


describe("Data", () => {

    let empty: Data<string>;
    let example: Data<string>;
    const example_keys: string[] = ["a", "x"];
    const example_values: string[] = ["b", "y"];
    const example_pairs: [string, string][] = [["a", "b"], ["x", "y"]];
    const example_inverse: [string, string][] = [["b", "a"], ["y", "x"]];

    beforeEach(() => {
        empty = {};
        example = {"a": "b", "x": "y"};
    });

    describe("length()", () => {
        it("gives the expected length", () => {
            assert(length(example) === example_keys.length);
        });

    });

    describe("equals()", () => {
        it("returns true for identity", () => {
            assert(equals(example, example));
        });

        it("returns false for different lengths", () => {
            const data2: Data<string> = {"x": "y", "z": "!", "q": "M"};
            assert(!equals(example, data2));
        });

        it("returns false when everything but one value is the same", () => {
            const data2: Data<string> = {"x": "y", "a": "NOoOOOOOOO"};
            assert(!equals(example, data2));
        });

        it("returns false when everything but one key is the same", () => {
            const data2: Data<string> = {"@": "y", "a": "b"};
            assert(!equals(example, data2));
        });

        it("returns true for equivalence", () => {
            const data1: Data<string> = {"x": "y"};
            const data2: Data<string> = {"x": "y"};
            // Javascript doesn"t think it"s equal
            assert(data1 !== data2);
            // But it knows it"s equal
            assert(equals(data1, data2));
        });
    });

    describe("keys()", () => {
        it("returns empty array for empty data", () => {
            const result = keys(empty);
            assert(result.length === 0);
        });

        it("returns expected keys", () => {
            assert(sorted_equal(keys(example), example_keys));
        });

        it("leaves out prototype properties", () => {
            // Okay I really don"t know how to test this without
            // being illegal in TypeScript, so let"s just say it does
        });
    });


    describe("values()", () => {
        it("returns empty array for empty data", () => {
            const result = values(empty);
            assert(result.length === 0);
        });

        it("returns expected values", () => {
            const x1 = values(example);
            const x2 = example_values;
            assert(sorted_equal(values(example), example_values));
        });
    });


    describe("pairs()", () => {
        it("returns empty array for empty data", () => {
            const result = pairs(empty);
            assert(result.length === 0);
        });

        it("returns expected pairs", () => {
            const result = pairs(example);
            const expected = example_pairs;
            assert(pairs_equal(result, expected));
        });
    });

    describe("each()", () => {
        it("calls the callback once for each pair", () => {
            // Record of calls
            const calls: [string, string][] = [];
            assert(calls.length === 0);

            // This callback updates counts
            function callback(key: string, value: string): void {
                calls.push([key, value]);
            }

            each(example, callback);
            assert(calls.length === example_keys.length);
        });
    });

    describe("map()", () => {
        it("does its thing", () => {
            function callback(key: string, value: string): [string, string] {
                return [value, key];
            }
            const result = map(example, callback);
            assert(result["b"] === "a");
            assert(result["y"] === "x");
        });
    });


    describe("copy()", () => {
        it("makes a distinct instance with the same data", () => {
            const result = copy(example);
            // they are not the same object.
            assert(example !== result);
            // but not just because equality always fails.
            assert(example === example);
            // both contain the same example.
            assert(pairs_equal(pairs(example), pairs(result)));
            // but not just because both are empty.
            assert(keys(example).length > 0);
        });
    });


    describe("as_strings()", () => {
        it("serializes into an array containing the expected pairs", () => {
            const result = as_strings(example);
            const expected = ["a=b", "x=y"];
            assert(sorted_equal(result, expected));
        });
    });


    describe("as_string()", () => {
        it("serializes into a blob containing the expected everything", () => {
            const result = as_string(example, ",");
            assert(result === "a=b,x=y");
        });
    });

    describe("arrays_equal()", () => {

        it("returns true for identity", () => {
            const x = ["foo"];
            assert(arrays_equal(x, x));
        });

        it("returns false for length difference", () => {
            const x = [1];
            const y = [1, 1];
            assert(!arrays_equal(x, y));
        });

        it("returns false for mismatch at same length", () => {
            const x = [1, 2];
            const y = [1, 3];
            assert(!arrays_equal(x, y));
        });

    });

    describe("pairs_equal()", () => {
        it("returns false for length difference", () => {
            const x: [number, number][] = [[1, 1]];
            const y: [number, number][] = [[1, 1], [2, 2]];
            assert(!pairs_equal(x, y));
        });

        it("returns false for mismatch at same length", () => {
            const x: [number, number][] = [[1, 1], [2, 3]];
            const y: [number, number][] = [[1, 1], [2, 2]];
            assert(!pairs_equal(x, y));
        });
    });

});
