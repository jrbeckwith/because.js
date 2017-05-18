import { BecauseError } from "../../errors";
import { Response } from "../../response";
import { parse_response, parse_array } from "../../parse";
import { Point } from "../../location";
import { URL } from "../../http";
import { Route, RouteData, Leg, Step } from "./route";


class RoutingParseError extends BecauseError {
}


// These records provide endpoints which require (x,y) for origin and dest.
class RoutingData {
    name: string;
    description: string;
    //  endpoint: string - has originx originy destinationx destinationy in it.
    endpoint: string;
    accessList: string[];
    apidoc: URL;
}

class Routing {
    constructor (
        public name: string,
        public description: string,
        public endpoint: string,
        public roles: string[],
        public doc: URL,
    ) {
    }
}


export function parse_route(response: Response): Route {
    // checks: errorCode, errormessage.
    const data = parse_response<RouteData>(response);
    // ignores: id
    // to be used: distance, duration; legs, geometry
    const legs = [];
    for (const leg_data of data.legs) {
        const steps = [];
        for (const step_data of leg_data.steps) {
            const points = [];
            for (const point_data of step_data.geometry.coordinates) {
                const point = new Point(point_data[0], point_data[1]);
                points.push(point);
            }
            const step = new Step(
                points,
                step_data.instructions,
                step_data.distance,
                step_data.duration,
            );
            steps.push(step);
        }
        const leg = new Leg(steps, leg_data.distance, leg_data.duration);
        legs.push(leg);
    }
    const route = new Route(
        legs,
        data.distance,
        data.duration,
    );
    return route;
}

export function parse_routings(response: Response): Routing[] {
    const records = parse_array<RoutingData>(response);
    return records.map((record) => {
        return new Routing(
            record.name,
            record.description,
            record.endpoint,
            record.accessList,
            record.apidoc as URL,
        );
    });
}
