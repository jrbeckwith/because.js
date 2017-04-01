import { Response, parse_response } from "../response";
import { URL } from "../request";


class BasemapData {
    errorCode: number;
    errorMessage: string;
}


type Standard = "XYZ" ;
type TileFormat = "PNG" ;


/**
 * Result from the basemaps discovery endpoint.
 */
export class Basemap {
    constructor (
        // URL template. Should specify placeholders for x, y, and z.
        public url: URL,
        public standard: Standard,
        public tile_format: TileFormat,
        public title: string,
        public attribution: string,
        public access_list: string[],
        public description: string,
        public thumbnail: string | undefined,
        public headers: undefined,
        public style_url: URL,
    ) {
        if (tile_format !== "PNG") {
            throw new Error("only tile_format=PNG basemaps are supported");
        }
        if (standard !== "XYZ") {
            throw new Error("only stnadard=XYZ basemaps are supported");
        }
        // Inspect URL for parameter names as validation
        const regex = /{\-?([a-zA-Z_]+)}/g;
        const matches = regex.exec(url as string) || [];
        for (const match of matches) {
            console.log("match", match); // TODO
        }
    }
}


function parse_basemap(response: Response): Basemap {
    const data = parse_response<BasemapData>(response);
    // TODO
    return new Basemap(
        // url
        "" as URL,
        // standard
        "XYZ" as Standard,
        // tile_format
        "PNG" as TileFormat,
        // title
        "",
        // attribution
        "",
        // access_list
        [],
        // description
        "",
        // thumbnail
        "",
        // headers
        undefined,
        // style_url
        "" as URL,
    );
}
