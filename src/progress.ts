/**
 * Tools for representing the discrete progress of some process.
 *
 * This doesn't care about what the progress is of, or how it might be updated.
 * It's just a bundle of data with some convenience methods. But a normal use
 * would be to track the number of bytes sent or received in an HTTP
 * request/response cycle.
 */

/** This line does nothing but make typedoc render the module comment. */

export interface ProgressInterface {
    readonly done: number;
    readonly total: number;
    readonly left: number;
    readonly percent: number;
}


export class ProgressEventInterface {
    loaded: number;
    total: number;
}

/**
 * Internal representation for progress on things like HTTP response downloads.
 */
export class Progress implements ProgressInterface {

    /**
     * Count of items handled so far.
     * Internal representation only available through accessors.
     */
    private _done: number;

    /**
     * Count of items to be handled, including those done.
     * Internal representation only available through accessors.
     */
    private _total: number;

    /**
     * @param done      Count of items handled so far.
     * @param total     Count of items to be handled, including those done.
     */

    constructor (done?: number, total?: number) {
        this._done = (typeof done === "undefined" ? NaN : done);
        this._total = (typeof total === "undefined" ? NaN : total);
    }

    /**
     * @returns         Count of items handled so far.
     */
    get done(): number {
        return this._done;
    }

    /**
     * @returns         Count of items to be handled including, those done.
     */
    get total(): number {
        return this._total;
    }

    /**
     * @returns         Count of items yet to be done.
     */
    get left(): number {
        if (isNaN(this.total)) {
            return NaN;
        }
        return this.total - this.done;
    }

    /**
     * @returns         Percentage (out of 100) of (items done / total items).
     */
    get percent(): number {
        if (isNaN(this.done) || isNaN(this.total) || this.total === 0) {
            return NaN;
        }
        const cent = 100.0;
        return (this.done / this.total) * cent;
    }

    /**
     * Update state from a ProgressEvent.
     *
     * @param ev        ProgressEvent, as emitted in the browser.
     */
    update_from_event(ev: ProgressEventInterface) {
        this._done = ev.loaded;
        this._total = ev.total;
    }

}
