import { URL } from "./http";
import { Headers } from "./headers";

export class InvalidHost extends Error {
}

export class Host {
    url: URL;
    headers: Headers;

    constructor (url: URL, headers?: Headers) {
        this.url = url;

        // Validate that the URL looks vaguely sane as an absolute URL.
        // This helps protect everything downstream.
        const regex = /^(https?):\/\/(.+)$/;
        if (!url.match(regex)) {
            throw new InvalidHost(
                `can't create Host with malformed URL: ${url}`,
            );
        }
        this.headers = headers || new Headers();
    }
}
