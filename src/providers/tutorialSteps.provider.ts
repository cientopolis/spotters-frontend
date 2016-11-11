import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { TutorialStep } from '../models/tutorialStep';
import { constants } from '../app/app.constants';

import 'rxjs/Rx';

@Injectable()
export class TutorialStepsProvider {
    private tutorialStepsUrl = `${constants.endpoint}/tutorial_steps.json`;  // URL to web api

    constructor(private http: Http) {

    }

    getAll(): Observable<TutorialStep[]> {
        let tutorialSteps$ = this.http
            .get(this.tutorialStepsUrl, { headers: this.getHeaders() })
            .map(mapTutorialSteps)
            .catch(handleError);

        return tutorialSteps$;
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

function mapTutorialSteps(response: Response): TutorialStep[] {
    return response.json().map(toTutorialStep);
}

function toTutorialStep(r: any): TutorialStep {
    let tutorialStep = <TutorialStep>({
        id: r.id,
        title: r.title,
        text: r.text,
        createdAt: r.created_at
    });
    return tutorialStep;
}
