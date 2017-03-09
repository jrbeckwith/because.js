/**
 * Representations and routines for parsing geocoding service results.
 */

import { Response } from "../../response";
import { parse_response } from "../../parse";
import { Point, Address } from "../../location";
import { parse_geocodes } from "./parse";


export class GeocodesData {
    geocodePoints: GeocodeData[];
    errorCode: number;
    errorMessage: string;
    id: undefined;
}


/**
 * Define structure of result format from geocoding service
 */
export class GeocodeData {
    candidatePlace: string;
    candidateSource: string;
    score: number;
    x: number;
    y: number;
}


/**
 * ONE result from the geocoding service, a "candidate" matching some name or
 * lat/lon. The service will typically return an array of these.
 */
export class Geocode extends Point {
    // x: number;
    // y: number;
    // address: string;
    // score: number;
    // source: string;

    constructor (
        public address: Address,
        public source: string,
        public score: number,
        public x: number,
        public y: number,
    ) {
        super(x, y);
    }

    static parse(response: Response): Geocode[] {
        return parse_geocodes(response);
    }

}
