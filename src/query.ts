/**
 * Utilities for working with URL query strings.
 *
 * This module provides `Query`.
 *
 */

/** This line does nothing but make typedoc render the module comment. */

import { Data, as_string, map } from "./data";
import { Table } from "./table";


/**
 * Interchange format for data in query part of URLs.
 */
export class QueryData extends Data<string> {
}


/**
 * Public interface definition for Query.
 */
export interface QueryInterface {
    readonly encoded: string;
}


/**
 * Convenient encapsulated storage of URL query parameters.
 *
 * Most of the behavior is from [Table](./table.html). What this adds is
 * convenient conversion to a query string.
 */
export class Query extends Table<string> {
    protected readonly _data: QueryData;

    /**
     * @param data      JS object mapping query parameters to value strings.
     *                  If unspecified, the Query object will be empty.
     *
     * *Note:* if you are trying to clone an existing Query object, use its
     * copy() method instead of trying to pass it to the Query constructor,
     * or trying to extract and pass its data to the Query constructor.
     */
    constructor (data?: QueryData) {
        super(data || {});
    }

    get encoded(): string {
        const components = as_uri_components(this._data);
        return as_query_string(components);
    }

    url(url: string): string {
        const encoded = this.encoded;
        const result = encoded ? `${url}?${encoded}` : url ;
        return result;
    }
}


/**
 * Encode keys and values as URI components, e.g. for making a query string.
 *
 * @param data      Data object to be converted.
 * @returns         Data object with keys and values that are encoded as URI
 *                  components.
 */
export function as_uri_components(data: Data<string>) {
    return map(data, (key: string, value: string) => {
        return [
            encodeURIComponent(key),
            encodeURIComponent(value),
        ];
    });
}


/**
 * Serialize a data object into a query string.
 *
 * @param data      Data object to be serialized into a query string.
 * @returns         Query string ready to be appended to a URL (after "?").
 */
export function as_query_string(data: Data<string>) {
    return as_string(data, "&", "=");
}
