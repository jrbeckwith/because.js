import { Point } from "./point";
import { Response, parse_response } from "./response";

/**
 * Point representation used by GeometryData.
 */
type PointData = [number, number];


/**
 * Type wrapper for strings representing "street addresses."
 */
class Address extends String {
}


/**
 * Geometry representation used in StepData.
 */
class GeometryData {
    type: "LineString";
    coordinates: PointData[];
}

type Instructions = string;
type Distance = number;
type Duration = number;

/**
 * Define structure of objects in "steps" array in LegData.
 */
class StepData {
    distance: number;
    duration: number;
    instructions: Instructions;
    geometry: GeometryData;
}

/**
 * Define structure of objects in "legs" array in RouteData.
 */
class LegData {
    distance: number;
    duration: number;
    steps: StepData[];
}


/**
 * Define structure of routing service responses.
 */
class RouteData {
    id: null;
    errorCode: number;
    errorMessage: string;
    distance: number;
    duration: number;
    legs: LegData[];
    geometry: GeometryData;
}


export class Route {
    _legs: Leg[];
    _points: Point[];
    distance: Distance;
    duration: Duration;

    constructor (
        legs: Leg[],
        distance: Distance,
        duration: Duration,
        points?: Point[],
    ) {
        this._legs = legs;
        this.distance = distance;
        this.duration = duration;
        this._points = points || [];
    }

    get legs(): Leg[] {
        return this._legs;
    }

    get steps(): Step[] {
        const steps: Step[] = [];
        for (const leg of this.legs) {
            steps.push(...leg.steps);
        }
        return steps;
    }

    get points(): Point[] {
        const points: Point[] = [];
        for (const step of this.steps) {
            points.push(...step.points);
        }
        return points;
    }

    get instructions(): Instructions[] {
        const lines: string[] = [];
        for (const step of this.steps) {
            lines.push(step.instructions);
        }
        return lines;
    }

    progress(leg: number, step: number, point: number) {
        leg = leg || 0;
        step = step || 0;
        point = point || 0;
    }
}


export class Leg {
    _steps: Step[];
    distance: Distance;
    duration: Duration;

    constructor (steps: Step[], distance: number, duration: number) {
        this._steps = steps;
        this.distance = distance;
        this.duration = duration;
    }

    get steps() {
        return this._steps;
    }

    get points(): Point[] {
        const points: Point[] = [];
        for (const step of this.steps) {
            points.push(...step.points);
        }
        return points;
    }

    get instructions(): Instructions[] {
        const lines: string[] = [];
        for (const step of this.steps) {
            lines.push(step.instructions);
        }
        return lines;
    }

}


export class Step {
    _points: Point[];
    instructions: Instructions;
    distance: Distance;
    duration: Duration;

    constructor (
        points: Point[],
        instructions: Instructions,
        distance: Distance,
        duration: Duration,
    ) {
        this._points = points;
        this.instructions = instructions;
        this.distance = distance;
        this.duration = duration;
    }

    get points(): Point[] {
        return this._points;
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
