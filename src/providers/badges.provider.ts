import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Badge } from '../models/badge';
import { User } from '../models/user';
import { Classification } from '../models/classification';
import { Message } from '../models/message';
import { Vote } from '../models/vote';
import { CurrentLocationService } from '../utils/currentLocation.service';
import { constants } from '../app/app.constants';
import 'rxjs/Rx';
import _ from 'lodash';
import { AuthHttp } from 'angular2-jwt';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class BadgesProvider {
  private badgesUrl = `${constants.endpoint}/users/badges.json`;  // URL to web api

  constructor(private authService: AuthService, private authHttp: AuthHttp) {

  }

  getAll(params = {}): Observable<Badge[]> {
    let badges$ = this.authHttp
      .get(this.badgesUrl, { headers: this.getHeaders() })
      .map(r => mapBadges(r.json().badges))
      .catch(handleError);

    return badges$;
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

function mapBadges(r: any): Badge[] {
  return r.map(toBadge);
}

function toBadge(r: any): Badge {
  let badge = <Badge>({
    name: r.name,
    description: r.description,
    level: r.level,
    image_url: r.image_url
  });

  return badge;
}
