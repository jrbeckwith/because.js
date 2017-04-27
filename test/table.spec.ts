import { assert } from "chai";
import { arrays_equal, pairs_equal } from "../src/data";
import { Table, MutableTable } from "../src/table";


describe("Table", () => {

    const example = {
        "A": "B",
        "X": "Y",
    };

    beforeEach(() => {
    });

    describe("constructor", () => {
        it("works in a trivial smoke test", () => {
            const table = new Table({});
        });
    });

    describe("keys", () => {
        it("works in a trivial smoke test", () => {
            const table = new Table({"a": "b"});
            assert(arrays_equal(table.keys(), ["a"]));
        });
    });

    describe("values", () => {
        it("works in a trivial smoke test", () => {
            const table = new Table({"a": "b"});
            assert(arrays_equal(table.values(), ["b"]));
        });
    });

    describe("pairs", () => {
        it("works in a trivial smoke test", () => {
            const table = new Table({"a": "b"});
            assert(pairs_equal(table.pairs(), [["a", "b"]]));
        });
    });

    describe("length", () => {
        it("works correctly for empty instance", () => {
            const table = new Table({});
            assert(table.length === 0);
        });

        it("works correctly for non-empty instance", () => {
            const table = new Table(example);
            assert(table.length === 2);
        });
    });

    describe("get()", () => {
        it("works in a trivial smoke test", () => {
            const table = new Table(example);
            assert(table.get("X") === "Y");
        });
    });

    describe("copy()", () => {
        it("works in a trivial smoke test", () => {
            const table1 = new Table(example);
            const table2 = table1.copy();
            assert(table1 !== table2);
            assert(table2.get("A") === "B");
            assert(table2.get("X") === "Y");
        });
    });

    describe("updated()", () => {
        it("works in a trivial smoke test", () => {
            const table1 = new Table({"a": "x", "b": "y"});
            assert(table1.get("a") === "x");
            assert(table1.get("b") === "y");

            const table2 = new Table({"b": "z", "c": "q"});
            assert(table2.get("b") === "z");
            assert(table2.get("c") === "q");

            const table3 = table2.updated(table1);
            assert(table3.get("a") === "x");
            assert(table3.get("b") === "y");
            assert(table3.get("c") === "q");
        });
    });

    describe("data()", () => {
        it("works in a trivial smoke test", () => {
            const table = new Table(example);
            const data = table.data();
            assert(data["A"] === "B");
            assert(data["X"] === "Y");
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

            const table = new Table(example);
            table.each(callback);
            assert(calls.length === 2);
        });
    });

    describe("map()", () => {
        it("returns table with pairs mapped by the given callback", () => {
            const table1 = new Table(example);
            const table2 = table1.map((key: string, value: string) => {
                return [value, key];
            });
            assert(table2.get("B") === "A");
            assert(table2.get("Y") === "X");
        });
    });

});


describe("MutableTable", () => {
    describe("update()", () => {
        it("works in a trivial smoke test", () => {
            const patches = new Table({"a": "x", "b": "y"});
            assert(patches.get("a") === "x");
            assert(patches.get("b") === "y");

            const mutable = new MutableTable({"b": "z", "c": "q"});
            assert(mutable.get("b") === "z");
            assert(mutable.get("c") === "q");

            mutable.update(patches);
            assert(mutable.get("a") === "x");
            assert(mutable.get("b") === "y");
            assert(mutable.get("c") === "q");
        });
    });

});
