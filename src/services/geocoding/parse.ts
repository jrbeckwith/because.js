import { Response } from "../../response";
import { parse_response } from "../../parse";
import { Geocode, GeocodesData } from "./geocode";


class ParseError extends Error {}


export function parse_geocodes(response: Response): Geocode[] {
    const data = parse_response<GeocodesData>(response);
    // The envelope is irrelevant after we've checked for an error
    return data.geocodePoints.map((item) => {
        return new Geocode(
            // address
            item.candidatePlace,
            // source
            item.candidateSource,
            // score
            item.score,
            // point
            item.y,
            item.x,
        );
    });
}
