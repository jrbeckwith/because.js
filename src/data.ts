/**
 * Tools for working with data in plain Javascript objects.
 *
 * This module is for working with what might be called "data objects": objects
 * of no particular type that are used as `{key: value}` mappings, with string
 * keys, and values that are all some other type.
 *
 * Data objects are easy to make and are commonly and idiomatically used all
 * over the place in JS, so this is a natural choice of parameter types for
 * many public interfaces.
 *
 * However, public interfaces may be passed all kinds of objects. In JS, where
 * type "object" has so many distinct functions, this can cause treacherous
 * snafus, like when properties come in from the prototype chain requiring
 * filtering with `Object.hasOwnProperty`, or like when certain properties are
 * really methods, or like when there is a property named `hasOwnProperty`.
 * Unless you can absolutely ensure that nobody passes anything weird (and you
 * can't if you are offering a public JS API for others to use), then careful
 * handling is required to avoid baffling bugs that may cause problems far from
 * the point of origin.
 *
 * This provides a strong reason to codify that careful handling in some
 * functions and then just use those functions instead of repeatedly and
 * partially implementing the same functions all over your code. Therefore:
 *
 * This module explains to TypeScript what data objects are, and then provides
 * a lot of generic functions to do the normal things you'd want to do on data
 * objects, in relatively careful ways.
 *
 * If you want a layer of protection against snafus, and especially if you want
 * to store data objects and work with them more easily, you might be
 * interested in the "Table" wrapper in table.ts.
 *
 */

/** This line does nothing but make typedoc render the module comment. */

// (We can't rely on being able to use ES6 Map if we want to be able to target
// ES5. Ugh.)

// Ugh
/** Internal interface defining types that define length.
 */
export interface Len {
    length: number;
}

/**
 * Defines "data objects."
 *
 * This is a generic structural class substitutable for Javascript objects with
 * string properties and monomorphic values. This type is suitable for
 * interfaces and internal representations which need interop with JS objects.
 * Aside from this trivial definition, rest of this file is dedicated to
 * functions for working on this representation more safely.
 *
 * (If you want an encapsulated object, use or subclass
 * [Table](./table.html) instead.)
 *
 * @param ValueType     Type of stored values.
 */
export class Data<ValueType> {
    [key: string]: ValueType;
}


/**
 * Count the number of pairs stored in a data object.
 *
 * @param ValueType     Type of stored values.
 */
export function length<ValueType>(data: Data<ValueType>): number {
    // Unbelievable that we have to define this at all. Ugh.
    // in any case we are internally iterating, which is O(n). Ugh.
    return Object.keys(data).length;
}

/**
 * List the keys in a data object.
 *
 * (This function does the hasOwnProperty dance for everything else. This is
 * clean, but it means multiple iterations over the array for everything. Ugh.)
 *
 * @param ValueType     Type of stored values.
 */
export function keys<ValueType>(data: Data<ValueType>): string[] {
    const result: string[] = [];
    for (const property in data) {
        if (data.hasOwnProperty(property)) {
            result.push(property);
        }
    }
    return result;
}

/**
 * List the values in a data object.
 *
 * @param ValueType     Type of stored values.
 *
 */
export function values<ValueType>(data: Data<ValueType>): ValueType[] {
    // We can't rely on being able to use iterators. Ugh.
    const result: ValueType[] = [];
    for (const key of keys(data)) {
        result.push(data[key]);
    }
    return result;
}

/**
 * List the [key, value] pairs in a data object.
 *
 * @param ValueType     Type of stored values.
 */
export function pairs<ValueType>
(data: Data<ValueType>): [string, ValueType][] {
    const result: [string, ValueType][] = [];
    for (const key of keys(data)) {
        result.push([key, data[key]]);
    }
    return result;
}

/**
 * Shallow comparison of two data objects.
 *
 * @param ValueType     Type of stored values.
 */
export function equals<ValueType>
(a: Data<ValueType>, b: Data<ValueType>): boolean {
    if (a === b) {
        return true;
    }
    const keys_a = keys(a);
    const keys_b = keys(b);
    if (keys_a.length !== keys_b.length) {
        return false;
    }
    keys_a.sort();
    keys_b.sort();
    for (let i = 0; i < keys_a.length; i++) {
        const key_a = keys_a[i];
        const key_b = keys_b[i];
        if (key_a !== key_b) {
            return false;
        }
        const value_a = a[key_a];
        const value_b = b[key_b];
        if (value_a !== value_b) {
            return false;
        }
    }
    return true;
}

/**
 * Helper function (mostly for tests).
 *
 * @param ValueType     Type of stored values.
 */
export function arrays_equal<ValueType>
(a: ValueType[], b: ValueType[]): boolean {
    if (a === b) {
        return true;
    }
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        const item_a: ValueType = a[i];
        const item_b: ValueType = b[i];
        // rarely, the value 'undefined' may be stored in one while the other
        // just does not have that key defined. you'd need pairs of this
        // situation to ensure arrays had the same length.
        if (item_a !== item_b) {
            return false;
        }
    }
    return true;
}

/**
 * Helper function (mostly for tests).
 *
 * @param ValueType     Type of stored values.
 */
export function pairs_equal<KeyType, ValueType>
(a: [KeyType, ValueType][], b: [KeyType, ValueType][]) {
    if (a.length !== b.length) { return false; }
    for (let i = 0; i < a.length; i++) {
        const [ak, av] = a[i];
        const [bk, bv] = b[i];
        if (ak !== bk || av !== bv) {
            return false;
        }
    }
    return true;
}

/**
 * Type for callbacks taking a (key, value) pair and making side effects.
 *
 * @param ValueType     Type of stored values.
 */
export interface EachCallback<ValueType> {
    (key: string, value: ValueType): void;
}

/**
 * Type for callbacks taking a (key, value) pair and returning another.
 *
 * @param ValueType     Type of stored values.
 */
export interface PairCallback<ValueType> {
    (key: string, value: ValueType): [string, ValueType];
}
// (This isn't usable as a structural subtype of EachCallback? Ugh.)


/**
 * Run the side-effecting callback(k, v): void for each pair.
 *
 * @param ValueType     Type of stored values.
 */
export function each<ValueType>
(data: Data<ValueType>, callback: EachCallback<ValueType>) {
    for (const pair of pairs(data)) {
        callback(pair[0], pair[1]);
    }
}


/**
 * Return the result of applying callback to each pair returned by pairs().
 *
 * @param ValueType     Type of stored values.
 */
function map_pairs<ValueType>
(data: Data<ValueType>, callback: PairCallback<ValueType>) {
    const result: Array<[string, ValueType]> = [];
    for (const pair of pairs(data)) {
        result.push(callback(pair[0], pair[1]));
    }
    return result;
}


/**
 * Get the result of applying callback to each [k, v] pair as Data.
 *
 * @param ValueType     Type of stored values.
 */
export function map<ValueType>
(data: Data<ValueType>, callback: PairCallback<ValueType>) {
    const result: Data<ValueType> = {};
    for (const pair of map_pairs(data, callback)) {
        const [key, value] = pair;
        result[key] = value;
    }
    return result;
}


/**
 * Make a shallow copy of a data object..
 *
 * @param ValueType     Type of stored values.
 */
export function copy<ValueType>
(data: Data<ValueType>): Data<ValueType> {
    return map(data, (key: string, value: ValueType) => {
        return [key, value];
    });
}


/**
 * Turn pairs of data object into strings delimited by `sep`.
 *
 * @param ValueType     Type of stored values.
 */
export function as_strings<ValueType>
(data: Data<ValueType>, sep = "=") {
    const result: string[] = [];
    for (const pair of pairs(data)) {
        result.push(pair.join(sep));
    }
    return result;
}


/**
 * Turn a data object into string: join [k, v] on `item_sep`, join on `sep`.
 *
 * @param ValueType     Type of stored values.
 */
export function as_string<ValueType>
(data: Data<ValueType>, sep: string, item_sep = "=") {
    return as_strings(data, item_sep).join(sep);
}
