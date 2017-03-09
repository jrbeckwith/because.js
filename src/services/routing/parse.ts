import { Response } from "../../response";
import { parse_response } from "../../parse";
import { Point } from "../../location";
import { Route, RouteData, Leg, Step } from "./route";


class ParseError extends Error {}


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
