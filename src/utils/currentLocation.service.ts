import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Configuration } from '../models/configuration';
import { Candidate } from '../models/candidate';
import { Location } from '../models/location';

@Injectable()
export class CurrentLocationService {

    private _configuration = new BehaviorSubject<Configuration>(null);
    private _candidates = new BehaviorSubject<Candidate[]>([]);
    private _location = new BehaviorSubject<Location>(null);
    private _refresh = new BehaviorSubject<boolean>(false);

    configuration$ = this._configuration.asObservable();
    candidates$ = this._candidates.asObservable();
    location$ = this._location.asObservable();
    refresh$ = this._refresh.asObservable();

    getConfiguration(): Configuration {
        return this._configuration.getValue();
    }

    setConfiguration(configuration: Configuration) {
        this._configuration.next(configuration);
    }

    getCandidates(): Candidate[] {
        return this._candidates.getValue();
    }

    setCandidates(candidates: Candidate[]) {
        this._candidates.next(candidates);
    }

    getLocation(): Location {
        return this._location.getValue();
    }

    setLocation(location: Location) {
        this._location.next(location);
    }

    getRefresh(): boolean {
        return this._refresh.getValue();
    }

    setRefresh(refresh: boolean): void {
        this._refresh.next(refresh);
    }
}
