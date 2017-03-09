import { Point, Coordinates } from "../../location";
import { Response } from "../../response";
import { parse_route } from "./parse";


/**
 * Geometry representation used in StepData.
 */
class GeometryData {
    type: "LineString";
    coordinates: Coordinates[];
}

class Instructions extends String {
}

class Distance extends Number {
}

class Duration extends Number {
}

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
export class RouteData {
    id: undefined;
    distance: number;
    duration: number;
    legs: LegData[];
    geometry: GeometryData;

    errorCode: number;
    errorMessage: string;
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

    static parse(response: Response): Route {
        return parse_route(response);
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
        const lines = [];
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
        const lines = [];
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
