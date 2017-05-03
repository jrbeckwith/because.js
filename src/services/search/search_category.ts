export class SearchCategoryData {
    key: string;
    description: string;
}


export class SearchCategory {
    constructor (
        // Internal identifier
        public key: string,
        // For presentation to humans
        public description: string,
    ) {
    }
}
