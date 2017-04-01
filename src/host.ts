import { URL } from "./request";
import { Headers } from "./headers";


export class Host {
    url: URL;
    headers: Headers;

    constructor (url: URL, headers?: Headers) {
        this.url = url;
        this.headers = headers || new Headers();
    }
}
