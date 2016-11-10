import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Workflow } from '../models/workflow';
import { Task } from '../models/task';
import { constants } from '../app/app.constants';

import 'rxjs/Rx';

@Injectable()
export class WorkflowsProvider {
  private workflowsUrl = `${constants.endpoint}/workflows.json`;  // URL to web api

  constructor(private http: Http) {

  }

  getAll(): Observable<Workflow[]> {
    return this.http.get(this.workflowsUrl, { headers: this.getHeaders() }).map(res => res.json());
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

function mapWorkflows(response: Response): Workflow[] {
  return response.json().map(toWorkflow);
}

function mapTasks(r: any): Task[] {
  return r.map(toTask);
}

function toWorkflow(r: any): Workflow {
  let workflow = <Workflow>({
    id: r.id,
    name: r.name,
    tasks: mapTasks(r.tasks),
    first_task: toTask(r.first_task),
    createdAt: r.created_at
  });
  return workflow;
}

function toTask(r: any): Task {
  let task = <Task>({
    id: r.id,
    multiple: r.multiple,
    widget_type: r.widget_type,
    content: JSON.parse(r.content),
    createdAt: r.created_at
  })
  return task;
}
