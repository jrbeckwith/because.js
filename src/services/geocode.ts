/**
 * Representations and routines for parsing geocoding service results.
 */

import { Response, parse_response } from "./response";


/**
 * Define structure of result format from geocoding service
 */
export class GeocodeData {
    // -> address
    candidatePlace: string;
    // -> source
    candidateSource: string;
    // geocodePoints: [number, number][];  // TODO

    // TODO: are these there in the data?
    errorCode: number;
    errorMessage: string;
}


/**
 * ONE result from the geocoding service, a "candidate" matching some name or
 * lat/lon. The service will typically return an array of these.
 */
export class Geocode {
    x: number;
    y: number;
    address: string;
    score: number;
    source: string;

    constructor () {
    }

    static parse(response: Response): Geocode[] {
        return parse_geocode(response);
    }

}


function parse_geocode(response: Response): Geocode[] {
    const data = parse_response<GeocodeData>(response);
    return [new Geocode(
        // address
        // data.candidatePlace,
        // points
        // data.geocodePoints,
        // source
        // data.candidateSource,
    )];
}
