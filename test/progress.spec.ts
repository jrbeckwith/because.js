import { assert } from "chai";
import { Progress } from "../src/progress";


interface FakeProgressData {
    loaded: number;
    total: number;
    lengthComputable: boolean;
}


class FakeProgressEvent {
    name: string;
    loaded: number;
    total: number;

    constructor (name: string, parameters: FakeProgressData) {
        this.name = name;
        this.loaded = parameters.loaded || 0;
        this.total = parameters.total || 0;
    }

}


describe("Progress", () => {

    describe("constructor", () => {
        it("stores done", () => {
            const progress = new Progress(99, 100);
            assert(progress.done === 99);
        });

        it("stores total", () => {
            const progress = new Progress(99, 100);
            assert(progress.total === 100);
        });

        it("propagates done NaN", () => {
            const progress = new Progress(NaN, 100);
            assert(isNaN(progress.left));
        });

        it("propagates total NaN", () => {
            const progress = new Progress(99, NaN);
            assert(isNaN(progress.total));
        });
    });

    describe("left", () => {
        it("subtracts as expected", () => {
            const progress = new Progress(99, 100);
            assert(progress.left === 1);
        });

        it("propagates total NaN", () => {
            const progress = new Progress(1, NaN);
            assert(isNaN(progress.left));
        });

    });

    describe("percent", () => {
        it("works for 50/100 bytes", () => {
            const progress = new Progress(50, 100);
            assert(progress.percent === 50.0);
        });

        it("uses NaN if total is 0", () => {
            const progress = new Progress(1, 0);
            assert(isNaN(progress.percent));
        });

        it("propagates done NaN", () => {
            const progress = new Progress(NaN, 100);
            assert(isNaN(progress.percent));
        });

        it("propagates total NaN", () => {
            const progress = new Progress(99, NaN);
            assert(isNaN(progress.percent));
        });
    });

    describe("update_from_event", () => {
        it("updates from an event", () => {
            const ev = new FakeProgressEvent(
                "boring",
                {
                    "lengthComputable": true,
                    "loaded": 150,
                    "total": 200,
                },
            );
            const progress = new Progress(50, 100);
            progress.update_from_event(ev);
            assert(progress.done === 150);
            assert(progress.left === 50);
        });
    });

});
