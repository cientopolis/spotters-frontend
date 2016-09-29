import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { News } from './news';
import { constants } from '../app/app.constants';

import 'rxjs/Rx';

@Injectable()
export class NewsProvider {
    private newsUrl = `${constants.endpoint}/news.json`;  // URL to web api

    constructor(private http: Http) {

    }

    getAll(): Observable<News[]> {
        let news$ = this.http
            .get(this.newsUrl, { headers: this.getHeaders() })
            .map(mapNews)
            .catch(handleError);

        return news$;
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

function mapNews(response: Response): News[] {
    return response.json().map(toNews);
}

function toNews(r: any): News {
    let news = <News>({
        id: r.id,
        title: r.title,
        text: r.text,
        createdAt: r.created_at
    });
    return news;
}
