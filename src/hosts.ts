import { URL } from "./http";
import { Host } from "./host";


// Shortcut
export {
    Host,
};


export const urls: {[env: string]: URL} = {
    "dev": "https://api.dev.boundlessgeo.io/v1",
    "test": "https://api.test.boundlessgeo.io/v1",
    "prod": "https://api.boundlessgeo.io/v1",
    "local": "http://localhost:8000/v1",
};


export const hosts: {[env: string]: Host} = {
    "dev": new Host(urls.dev),
    "test": new Host(urls.test),
    "prod": new Host(urls.prod),
    "local": new Host(urls.local),
};
