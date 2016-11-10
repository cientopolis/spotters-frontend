import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { Candidate } from '../models/candidate';
import { User } from '../models/user';
import { Message } from '../models/message';
import { Vote } from '../models/vote';
import { constants } from '../app/app.constants';
import 'rxjs/Rx';

@Injectable()
export class MessagesProvider {

  constructor(private http: Http, private authHttp: AuthHttp) {

  }

  create(candidate: Candidate, message: string): Observable<Message> {
    let messagesUrl = `${constants.endpoint}/candidates/${candidate.id}/messages.json`;
    let message$ = this.authHttp
      .post(messagesUrl, {
        message: { text: message }
      }, { headers: this.getHeaders() })
      .map(r => toMessage(r.json()))
      .catch(handleError);

    return message$;
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
