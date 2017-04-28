import { Data } from "./data";

const REGEX = /{(.+?)}/g;


export function format(template: string, data?: Data<string>) {
    return template.replace(REGEX, (match, value) => {
        return (data ? data[value] : undefined) || "";
    });
}
