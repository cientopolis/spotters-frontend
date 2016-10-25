import _ from 'lodash';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CurrentLocationService {
    private _lat = new BehaviorSubject<number>(null);
    private _lng = new BehaviorSubject<number>(null);
    private _heading = new BehaviorSubject<number>(null)
    private _pitch = new BehaviorSubject<number>(null);

    lat$ = this._lat.asObservable();
    lng$ = this._lng.asObservable();
    heading$ = this._heading.asObservable();
    pitch$ = this._pitch.asObservable();

    getLat(): number {
        return this._lat.getValue();
    }

    setLat(lat: number) {
        this._lat.next(lat);
    }

    getLng(): number {
        return this._lng.getValue();
    }

    setLng(lng: number): void {
        this._lng.next(lng);
    }

    getHeading(): number {
        return this._heading.getValue();
    }

    setHeading(heading: number): void {
        this._heading.next(heading);
    }

    getPitch(): number {
        return this._pitch.getValue();
    }

    setPitch(pitch: number): void {
        this._pitch.next(pitch);
    }

    isBlank() {
        return _.isNull(this.getLat()) && _.isNull(this.getLng()) && _.isNull(this.getHeading()) && _.isNull(this.getPitch());
    }
}