import { Response } from "../../response";
import { ParseError } from "../../errors";
import { parse_response } from "../../parse";
import {
    SearchResultEnvelope,
    SearchResultData,
    SearchResult,
} from "./search_result";


export function parse_search_results(response: Response): SearchResult[] {
    const result = parse_response<SearchResultEnvelope>(response);
    return result.features.map((feature: SearchResultData) => {
        return new SearchResult(
            feature.properties.title,
            feature.properties.url,
            feature.properties.id,
            feature.properties.role,
            feature.properties.category,
            feature.properties.description,
            feature.geometry.coordinates[0],
            feature.geometry.coordinates[1],
        );
    });
}
