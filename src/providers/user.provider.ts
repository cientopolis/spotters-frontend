import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { constants } from '../app/app.constants';
import { User } from '../models/user';

import 'rxjs/Rx';

@Injectable()
export class UserProvider {
    private userUrl = `${constants.endpoint}/users.json`;  // URL to web api

    constructor(private http: Http, private authHttp: AuthHttp) {

    }

    sync(token: string, user: Object): Observable<any> {
        return this.http
            .post(this.userUrl, {
                token: token,
                user: user
            }, { headers: this.getHeaders() })
            .map(r => toUser(r.json()))
            .catch(handleError);
    }

    tutorial(): Observable<any> {
        let url = `${constants.endpoint}/users/tutorial.json`;
        return this.authHttp
            .post(url, {}, { headers: this.getHeaders() })
            .map(r => r.json().tutorial_complete)
            .catch(handleError);
    }

    tutorialComplete(): Observable<any> {
        let url = `${constants.endpoint}/users/tutorial_complete.json`;
        return this.authHttp
            .get(url, { headers: this.getHeaders() })
            .map(r => r.json().tutorial_complete)
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

function toUser(r: any): User {
  let user = <User>({
    sub: r.sub,
    name: r.name
  })
  return user;
}
