import { Point } from './point';

export class Configuration {
    id: number;
    title: string;
    lat: number;
    lng: number;
    zoom: number;
    headingCenter: number;
    pitchCenter: number;
    proximityDistance: number;
    bounds: Point[];
}