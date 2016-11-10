import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Configuration } from '../models/configuration';
import { constants } from '../app/app.constants';

import 'rxjs/Rx';

@Injectable()
export class ConfigurationProvider {
    private configurationsUrl = `${constants.endpoint}/confs.json`;  // URL to web api

    constructor(private http: Http) {

    }

    getAll(): Observable<Configuration[]> {
        let configurations$ = this.http
            .get(this.configurationsUrl, { headers: this.getHeaders() })
            .map(mapConfigurations)
            .catch(handleError);

        return configurations$;
    }

    private getHeaders() {
        let headers = new Headers();
        headers.append('Accept', 'application/json');
        return headers;
    }
}

function handleError(error: any) {
    let errorMsg = error.message || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
    console.error(errorMsg);

    return Promise.reject(errorMsg);
}

function mapConfigurations(response: Response): Configuration[] {
    return response.json().map(toConfiguration);
}

function toConfiguration(r: any): Configuration {
    let configuration = <Configuration>({
        id: r.id,
        title: r.title,
        lat: r.center.lat,
        lng: r.center.lng,
        zoom: r.zoom,
        headingCenter: r.heading_center,
        pitchCenter: r.pitch_center,
        proximityDistance: r.proximityDistance
    });
    return configuration;
}