import { pairs } from "./data";


/**
 * Define a mapping of arguments to be logged.
 */
interface Args {
    // Need this to be any for general purpose debugging without type wrestle.
    // tslint:disable-next-line
    [key: string]: any;
}


enum Level {
    debug = 7,
    info = 6,
    notice = 5,
    warning = 4,
    error = 3,
    critical = 2,
    // If you have an emergency, please hang up and dial 911 instead
}


const level_names: {[level: number]: string} = {};
// Workaround for not directly indexing with enum
level_names[Level.debug] = "debug";
level_names[Level.warning] = "warning";
level_names[Level.error] = "error";

/**
 * Define a source of log messages.
 *
 * Typical usage would be to have one of these per instance of a class complex
 * enough to need logging for debug. Normally this would be private to the
 * class so that it only reflects the "voice" of that particular instance.
 *
 */
export class Log {
    name: string;

    constructor (name: string) {
        this.name = name;
    }

    protected emit(level: Level, text: string, args?: Args): void {
        const level_name = level_names[level];
        const prefix = `${this.name}: ${level_name}:`;
        for (const pair of pairs(args || {})) {
            const [key, value] = pair;
            // tslint:disable-next-line
            console.log(prefix, key, value);
        }
    }

    debug(text: string, args?: Args): void {
        this.emit(Level.debug, text, args);
    }

    warning(text: string, args?: Args): void {
        this.emit(Level.warning, text, args);
    }

    error(text: string, args?: Args): void {
        this.emit(Level.error, text, args);
    }
}
