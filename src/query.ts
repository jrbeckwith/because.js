/**
 * Utilities for working with URL query strings.
 *
 * This module provides `Query`.
 *
 */

/** This line does nothing but make typedoc render the module comment. */

import { Data, as_string, copy, map, updated } from "./data";
import { MutableTable } from "./table";


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
export class Query extends MutableTable<string> {
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

    copy(): Query {
        return new Query(copy(this._data));
    }

    /**
     * Make a copy of the table with k/v overrides from another table.
     */
    updated(other: Query): Query {
        const data = updated<string>(this._data, other.data());
        const result = new Query(data);
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
export function as_uri_components(data: Data<string | number>) {
    return map(data, (key: string, value: string | number) => {
        if (typeof value === "number") {
            value = value.toString();
        }
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
export function as_query_string(data: Data<string | number>) {
    return as_string(data, "&", "=");
}
