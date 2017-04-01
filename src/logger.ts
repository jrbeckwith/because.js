import { pairs } from "./data";

interface Args {
    [key: string]: any;
}


class Level extends String {
}


export class Logger {
    name: string;

    constructor (name: string) {
        this.name = name;
    }

    protected log(level: Level, args?: Args): void {
        const prefix = `${this.name}: ${level}:`;
        for (const pair of pairs(args || {})) {
            const [key, value] = pair;
            // tslint:disable-next-line
            console.log(prefix, key, value);
        }
    }

    debug(args?: Args): void {
        this.log("debug", args);
    }

    warning(args?: Args): void {
        this.log("warning", args);
    }

    error(args?: Args): void {
        this.log("error", args);
    }
}
