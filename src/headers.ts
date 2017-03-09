/**
 * Tools for working with HTTP request or response headers.
 *
 * Extends `Table` from `table.ts`.
 *
 */

/** This line does nothing but make typedoc render the module comment. */

import { Data, map, copy } from "./data";
import { Table, MutableTable } from "./table";

/**
 * Interchange type for HTTP request or response header data.
 *
 * This is defined separately from Data only to provide an extension point
 * specific to data objects that represent headers. For more on the underlying
 * behavior, see [Data](./data.html).
 */
export class HeaderData extends Data<string> {
}

/**
 * Function defining how keys are normalized by Headers.
 *
 * @param key   String to normalize as a key.
 * @returns     Normalized version of the given key.
 */
function normalize(key: string) {
    return key.toLowerCase();
}


/**
 * Parse output as from XMLHttpRequest.getAllResponseHeaders().
 */
export function parse_headers(
    headers: ByteString | null, limit?: number,
): HeaderData {
    // "null if no response has been received"
    // "If a network error happened, an empty string is returned"
    if (!headers) {
        return {};
    }
    if (limit && headers.length > limit) {
        throw new Error("not parsing oversized headers string");
    }
    // Lines separated by CRLF.
    const line_sep = "\r\n";
    const lines = headers.split(line_sep);
    // Pairs separated by colon.
    const pair_sep = ": ";
    const data: HeaderData = {};
    for (const line of lines) {
        const index = line.indexOf(pair_sep);
        const key = line.slice(0, index);
        const value = line.slice(index + pair_sep.length);
        if (key) {
            data[key] = value;
        }
    }
    return data;
}

/**
 * Class for objects holding HTTP request or response headers.
 *
 * Most of the behavior is from `Table`. This adds:
 * * key normalization, since HTTP header names aren't case-sensitive;
 * * automatically combining lists of string values into comma-separated
 *   strings.
 *
 */
export class Headers extends MutableTable<string> {

    /**
     * @param data      JS object mapping header names to header value strings.
     *                  If unspecified, the Headers object will be empty.
     *
     * *Note:* if you are trying to clone an existing Headers object, use its
     * copy() method instead of trying to pass it to the Headers constructor,
     * or trying to extract and pass its data to the Headers constructor.
     */
    constructor (data?: HeaderData) {
        // Normalize header names on the way in.
        const normalized = map(
            data || {},
            (key: string, value: string) => {
            return [normalize(key), value];
        });
        super(normalized);
    }

    /**
     * Alternate constructor based on parse_headers.
     * Example: Headers.parse("foo: bar\r\nbaz: bam\r\n")
     */
    static parse(blob: ByteString) {
        const data: HeaderData = parse_headers(blob);
        return new Headers(data);
    }

    /**
     * Retrieve the header value for a specified header name.
     *
     * @param key   Header name to retrieve the value for.
     */
    get(key: string): string {
        // Normalize requested key
        return this._data[normalize(key)];
    }

    /**
     * Set the header value for a specified header name.
     *
     * @param key       Header name to set the value for.
     * @param value     Header value to set.
     *                  This may be a string, or a list of strings;
     *                  a list of strings will be joined by ","
     *                  per RFC 2616.
     */
    set(key: string, value: string | string[]): void {
        let result: string;
        if (typeof(value) === "string") {
            result = value;
        }
        else {
            result = value.join(",");
        }
        // Normalize header names on the way in.
        this._data[normalize(key)] = result;
    }
}
