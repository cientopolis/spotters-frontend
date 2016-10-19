import _ from 'lodash';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CurrentLocationService {
    private _lat = new BehaviorSubject<number>(null);

    lng: number = null;
    heading: number = null;
    pitch: number = null;
    refresh: boolean = false;

    lat$ = this._lat.asObservable();

    getLat(): number {
        return this._lat.getValue();
    }

    setLat(lat: number) {
        this._lat.next(lat);
    }

    isBlank() {
        return _.isNull(this.lng) && _.isNull(this.heading) && _.isNull(this.pitch);
    }
}


/*
import _ from 'lodash';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class CurrentLocationService {
    private _lat = new Subject<number>();
    lng: number = null;
    heading: number = null;
    pitch: number = null;

    /*private _lng = new Subject<number>()
    private _heading = new Subject<number>()
    private _pitch = new Subject<number>()
*//*
    lat$ = this._lat.asObservable();
    /*  lng$ = this._lng.asObservable();
      heading$ = this._heading.asObservable();
      pitch$ = this._pitch.asObservable();
  */

/*
    setLat(lat: number) {
        this._lat.next(lat);
    }

    isBlank() {
        //return _.isNull(this._lat) && _.isNull(this._lng) && _.isNull(this._heading) && _.isNull(this._pitch);
        return _.isNull(this._lat) && _.isNull(this.lng) && _.isNull(this.heading) && _.isNull(this.pitch);
    }

}
*/
