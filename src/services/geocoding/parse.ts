import { BecauseError } from "../../errors";
import { Response } from "../../response";
import { parse_response, parse_array } from "../../parse";
import { Geocode, GeocodesData } from "./geocode";


class GeocodingParseError extends BecauseError {
}


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


class GeocodingData {
    name: string;
    description: string;
    endpoint: string;
    accessList: string[];
    apidoc: string;
}


export function parse_geocodings(response: Response): GeocodingData[] {
    const records = parse_array<GeocodingData>(response);
    return records;
}
