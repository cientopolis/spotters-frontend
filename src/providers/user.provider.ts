import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { constants } from '../app/app.constants';

import 'rxjs/Rx';

@Injectable()
export class UserProvider {
    private userUrl = `${constants.endpoint}/users.json`;  // URL to web api

    constructor(private http: Http) {

    }

    sync(token: string, user: Object): Observable<any> {
        return this.http
            .post(this.userUrl, {
                token: token,
                user: user
            }, { headers: this.getHeaders() })
            .catch(handleError);
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
