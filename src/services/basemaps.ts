import { URL } from "../request";
import { Service, Endpoint } from "../service";


/**
 * Result from the basemaps discovery endpoint.
 */
export class Basemap {
    constructor (
        // URL template. Should specify placeholders for x, y, and z.
        public url: URL,
        public standard: "XYZ",
        public tile_format: "PNG",
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
        for (const match in matches) {
            console.log("match", match); // TODO
        }
    }
}


/**
 * Definition for basemaps service.
 */
export class BasemapService extends Service {

    constructor () {
        const data = {
            "metadata": new Endpoint(
                "/basemaps/",
            ),
        };
        super(data);
    }

    parse(response: Response) {
    }
}


function parse_basemap(response: Response): Basemap {
    // TODO
    return new Basemap(
    );
}


