import { URL } from "../../http";
import { Response } from "../../response";
import { parse_response, parse_array } from "../../parse";
import { Basemap, BasemapData, Standard, TileFormat } from "./basemap";


class ParseError extends Error {}


export function parse_basemaps(response: Response): Basemap[] {
    const records: BasemapData[] = parse_array<BasemapData>(response);
    console.log("record", records[0]);
    return records.map((record) => {
        return new Basemap(
            // endpoint
            record.endpoint as URL,
            // standard
            record.standard as Standard,
            // tile_format
            record.tileFormat as TileFormat,
            // title
            record.name,
            // provider
            record.provider,
            // attribution
            record.attribution,
            // access_list
            record.accessList,
            // description
            record.description,
            // thumbnail
            record.thumbnail,
            // style_url
            record.styleUrl as URL,
        );
    });
}
