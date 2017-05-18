import { URL } from "../../http";
import { Point, Coordinates } from "../../location";


export class SearchResultEnvelope {
    type: "FeatureCollection";
    features: SearchResultData[];

    // Not actually present
    errorCode: number;
    errorMessage: string;
}


class GeometryData {
    coordinates: Coordinates;
    type: "Point";
}


class PropertiesData {
    category: string;
    description: string;
    id: string;
    role: string;
    title: string;
    url: URL;
}


export class SearchResultData {
    geometry: GeometryData;
    properties: PropertiesData;
    type: "Point";
}


export class SearchResult extends Point {
    constructor (
        public title: string,
        public url: URL,
        public id: string,
        public role: string,
        public category: string,
        public description: string,
        public x: number,
        public y: number,
    ) {
        super(x, y);
    }
}
