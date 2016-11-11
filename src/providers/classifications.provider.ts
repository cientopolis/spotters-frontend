import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { Candidate } from '../models/candidate';
import { Classification } from '../models/classification';
import { User } from '../models/user';
import { Vote } from '../models/vote';
import { constants } from '../app/app.constants';
import 'rxjs/Rx';

@Injectable()
export class ClassificationsProvider {

  constructor(private http: Http, private authHttp: AuthHttp) {

  }

  setStatus(candidate: Candidate, classification: Classification, status: string): Observable<Classification> {
    let classificationsUrl = `${constants.endpoint}/candidates/${candidate.id}/classifications/${classification.id}.json`;
    let classification$ = this.authHttp
      .put(classificationsUrl, {
        classification: { status: status }
      }, { headers: this.getHeaders() })
      .map(r => toClassification(r.json()))
      .catch(handleError);

    return classification$;
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

function mapVotes(r: any): Vote[] {
  return r.map(toVote);
}

function toUser(r: any): User {
  let user = <User>({
    sub: r.sub,
    name: r.name
  })
  return user;
}

function toClassification(r: any): Classification {
  let classification = <Classification>({
    id: r.id,
    status: r.status,
    data: JSON.parse(r.data),
    user: toUser(r.user),
    votes: mapVotes(r.classification_votes),
    createdAt: r.created_at
  });
  return classification;
}

function toVote(r: any): Vote {
  let vote = <Vote>({
    id: r.id,
    positive: r.positive,
    user: toUser(r.user),
    createdAt: r.created_at
  });
  return vote;
}
