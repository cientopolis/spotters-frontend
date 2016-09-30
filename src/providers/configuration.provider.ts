import { Injectable }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Configuration } from './configuration';
import { constants } from '../app/app.constants';

@Injectable()
export class ConfigurationProvider {
    private configurationUrl = `${constants.endpoint}/configurations.json`;  // URL to web api

    constructor(private http: Http) {
        
    }

    getConfiguration(): Promise<Configuration> {
        return this.http.get(`${this.configurationUrl}`)
            .toPromise()
            .then(response => response.json().data as Configuration)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}