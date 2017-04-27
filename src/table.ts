/**
 * Encapsulated key-value storage on top of JS data objects.
 * For more about data objects, see `data.ts`.
 */

/** This line does nothing but make typedoc render the module comment. */


import {
    Data,
    copy,
    updated,
    keys,
    values,
    pairs,
    each,
    map,
    length,
    equals,
    EachCallback,
    PairCallback,
    Len,
} from "./data";


/**
 * Convenient encapsulated storage for key-value mappings.
 *
 * This class wraps the lower-level functions from `data.ts`, exposing
 * primitive operations while hiding the representation.
 *
 * @param V     Type of values stored in the table.
 *
 */
export class Table<V> {
    /**
     * Internal data object encapsulated by this table.
     */
    protected _data: Data<V>;

    /**
     * Wrap the given data object with a Table.
     *
     * This doesn't copy the data object, so if you make changes to it without
     * using the table then you will break encapsulation. Easier ways to use it
     * would include passing an object literal or passing a copy.
     */
    constructor (data: Data<V>) {
        this._data = data;
    }

    /**
     * Give the number of items in the table.
     */
    get length(): number {
        return length(this._data);
    }

    /**
     * Compare this table to another for equality of their contents.
     */
    equals(table: Table<V>): boolean {
        return equals(table._data, this._data);
    }

    /**
     * Make a copy of the table based on a shallow copy of its contents.
     */
    copy(): Table<V> {
        return new Table<V>(copy(this._data));
    }

    /**
     * Make a copy of the table with k/v overrides from another table.
     */
    updated(other: Table<V>): Table<V> {
        const data = updated<V>(this._data, other._data);
        return new Table<V>(data);
    }

    /**
     * Make a shallow copy of the underlying data.
     */
    data(): Data<V> {
        return copy(this._data);
    }

    /**
     * Get the value for the specified key in the table.
     */
    get(key: string): V {
        return this._data[key];
    }

    /**
     * List the keys in the table.
     */
    keys(): string[] {
        return keys(this._data);
    }

    /**
     * List the values in the table.
     */
    values(): V[] {
        return values(this._data);
    }

    /**
     * List the `[key, value]` pairs in the table.
     */
    pairs(): [string, V][] {
        return pairs(this._data);
    }

    /**
     * Run the side-effecting `callback(key: string, value: V): void` for each
     * pair in the table.
     */
    each(callback: EachCallback<V>): void {
        each(this._data, callback);
    }

    /**
     * Get the result of applying callback to each `[key, value]` pair, as a
     * new table.
     */
    map(callback: PairCallback<V>): Table<V> {
        return new Table(map(this._data, callback));
    }
}


export class MutableTable<V> extends Table<V> {

    /**
     */
    get(key: string): V {
        return this._data[key];
    }

    /**
     */
    set(key: string, value: V): void {
        this._data[key] = value;
    }

    copy(): MutableTable<V> {
        return new MutableTable(copy(this._data));
    }

    /**
     * Make a copy of the table with k/v overrides from another table.
     */
    updated(other: Table<V>): MutableTable<V> {
        // TODO: makes copies, ugh
        const data = updated<V>(this._data, other.data());
        // can't really use super.updated(other)

        const result = new MutableTable<V>(data);
        return result;
    }

    /**
     * Set keys from another table.
     */
    update(other: Table<V>): void {
        for (const pair of other.pairs()) {
            const [key, value] = pair;
            this.set(key, value);
        }
    }
}
