import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Candidate } from '../models/candidate';
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
export class CandidatesProvider {
  private candidatesUrl = `${constants.endpoint}/candidates.json`;  // URL to web api


  constructor(private authService: AuthService, private http: Http, private currentLocation: CurrentLocationService, private authHttp: AuthHttp) {

  }

  create(lng: number, lat: number, heading: number, pitch: number): Observable<Candidate> {
    let cantidateUrl = `${constants.endpoint}/candidates.json`;
    let candidate$ = this.authHttp
      .post(cantidateUrl, {
        candidate: {
          status: 'active',
          lng: lng,
          lat: lat,
          heading: heading,
          pitch: pitch
        }
      }, { headers: this.getHeaders() })
      .map(r => {
        toCandidate(r.json())
      })
      .catch(handleError);
    return candidate$;
  }

  getAll(params = {}): Observable<Candidate[]> {
    let querystring = _.map(params, (value, key) => {
      return `${key}=${value}`;
    }).join('&');

    let candidates$ = this.http
      .get(`${this.candidatesUrl}?${querystring}`, { headers: this.getHeaders() })
      .map(mapCandidates)
      .catch(handleError);

    return candidates$;
  }

  setStatus(candidate: Candidate, status: string): Observable<Candidate> {
    let candidatesUrl = `${constants.endpoint}/candidates/${candidate.id}.json`;
    let candidate$ = this.authHttp
      .put(candidatesUrl, {
        candidate: { status: status }
      }, { headers: this.getHeaders() })
      .map(r => toCandidate(r.json()))
      .catch(handleError);

    return candidate$;
  }

  private getHeaders() {
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }
}

function handleError(error: any) {
  console.log('ocurrio un error en la peticion');
  let errorMsg = error.message || `Yikes! There was was a problem with our hyperdrive device and we couldn't retrieve your data!`
  console.error(errorMsg);

  return Promise.reject(errorMsg);
}

function mapCandidates(response: Response): Candidate[] {
  return response.json().map(toCandidate);
}

function mapClassifications(r: any): Classification[] {
  return r.map(toClassification);
}

function mapMessages(r: any): Message[] {
  return r.map(toMessage);
}

function mapVotes(r: any): Vote[] {
  return r.map(toVote);
}

function toCandidate(r: any): Candidate {
  let candidate = <Candidate>({
    id: r.id,
    status: r.status,
    heading: r.heading,
    pitch: r.pitch,
    lat: r.lat,
    lng: r.lng,
    owner: toUser(r.owner),
    expert: r.expert ? toUser(r.expert) : null,
    classifications: mapClassifications(r.classifications),
    messages: mapMessages(r.messages),
    createdAt: r.created_at
  });
  return candidate;
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

function toMessage(r: any): Message {
  let message = <Message>({
    id: r.id,
    text: r.text,
    user: toUser(r.user),
    votes: mapVotes(r.message_votes),
    createdAt: r.created_at
  });
  return message;
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
