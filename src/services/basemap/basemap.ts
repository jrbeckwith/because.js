import { URL } from "../../http";


export type BasemapProvider = string;
export type Standard = "XYZ" ;
export type TileFormat = "PNG" ;


export class BasemapData {
    name: string;
    attribution: string;
    provider: BasemapProvider;
    description: string;
    endpoint: string;
    accessList: string[];
    styleUrl: string;
    standard: Standard;
    tileFormat: TileFormat;
    thumbnail: undefined;

    errorCode: number;
    errorMessage: string;
}


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
        public provider: BasemapProvider,
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
