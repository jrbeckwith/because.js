/**
 * Internal no-frills representation for a point on a two-dimensional plane.
 *
 * It is up to the code using this to decide what it means; this doesn't do
 * anything like projection.
 *
 * Points are immutable because they are intended to work like values.
 */

/** This line does nothing but make typedoc render the module comment. */

/**
 * Structure of arrays passing a point as just two numbers.
 */
export interface Coordinates extends Array<number> {
    [key: number]: number;
    0: number;
    1: number;
}

export function is_coordinates(arg: Coordinates | Address): arg is Coordinates {
    return (typeof arg === "object" && arg.length === 2);
}

export class Point {
    public readonly x: number;
    public readonly y: number;

    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(other: Point): boolean {
        return (other.x === this.x && other.y === this.y);
    }
}


export class Address extends String {
}

export type Location = Address | Coordinates | Point;
