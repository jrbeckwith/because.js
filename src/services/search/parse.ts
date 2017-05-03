import { Response } from "../../response";
import { ParseError } from "../../errors";
import {
    parse_response,
    parse_array,
} from "../../parse";
import {
    SearchResultEnvelope,
    SearchResultData,
    SearchResult,
} from "./search_result";
import {
    SearchCategory,
    SearchCategoryData,
} from "./search_category";


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


export function parse_search_categories(response: Response): SearchCategory[] {
    const results = parse_array<SearchCategoryData>(response);
    return results.map((result: SearchCategoryData) => {
        return result as SearchCategory;
    });
}
