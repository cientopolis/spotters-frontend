import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { Candidate } from '../models/candidate';
import { Message } from '../models/message';
import { User } from '../models/user';
import { Vote } from '../models/vote';
import { constants } from '../app/app.constants';
import 'rxjs/Rx';

@Injectable()
export class MessageVotesProvider {

  constructor(private http: Http, private authHttp: AuthHttp) {

  }

  create(candidate: Candidate, message: Message, vote: boolean): Observable<Vote> {
    let messageVotesUrl = `${constants.endpoint}/candidates/${candidate.id}/messages/${message.id}/message_votes.json`;
    let vote$ = this.authHttp
      .post(messageVotesUrl, {
        message_vote: { positive: vote }
      }, { headers: this.getHeaders() })
      .map(r => toVote(r.json()))
      .catch(handleError);

    return vote$;
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

function toVote(r: any): Vote {
  let vote = <Vote>({
    id: r.id,
    positive: r.positive,
    user: toUser(r.user),
    createdAt: r.created_at
  });
  return vote;
}