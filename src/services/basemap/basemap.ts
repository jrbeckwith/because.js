import { Response } from "../../response";
import { parse_array } from "../../parse";
import { URL } from "../../http";


export class BasemapData {
    name: string;
    attribution: string;
    provider: string;
    description: string;
    endpoint: string;
    accessList: string[];
    styleUrl: string;
    standard: string;
    tileFormat: string;
    thumbnail: undefined;

    errorCode: number;
    errorMessage: string;
}


export type Standard = "XYZ" ;
export type TileFormat = "PNG" ;


/**
 * Result from the basemaps discovery endpoint.
 */
export class Basemap {

    constructor (
        // URL template. Should specify placeholders for x, y, and z.
        public endpoint: URL,
        public standard: Standard,
        public tile_format: TileFormat,
        public title: string,
        public provider: string,
        public attribution: string,
        public access_list: string[],
        public description: string,
        public thumbnail: string | undefined,
        public style_url: URL,
    ) {
        // TODO: Inspect endpoint for parameter names as validation
        // const regex = /{(\-?[a-zA-Z_]+)}/g;
        // const matches = regex.exec(url as string) || [];
        // for (const match of matches) {
        //     console.log("match", match); // TODO
        // }
    }
}
