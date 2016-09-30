import { Component, OnInit } from '@angular/core';
import { CandidatesProvider } from '../../providers/candidates.provider'
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Candidate } from '../../providers/candidate';
import { Workflow } from '../../providers/workflow';
import { Task } from '../../providers/task';
import { constants } from '../../app/app.constants';
import { NavController } from 'ionic-angular';
import _ from 'lodash';

@Component({
  selector: 'page-candidates',
  templateUrl: 'candidates.html'
})
export class CandidatesPage implements OnInit {
  candidates: Candidate[];
  workflows: Workflow[];
  displayMessages: [number, boolean][] = [];
  errorMessage: string = '';

  constructor(public navCtrl: NavController, private candidatesProvider: CandidatesProvider, private workflowsProvider: WorkflowsProvider) {

  }

  getCandidates(): void {
    this.candidatesProvider.getAll().subscribe(
         /* happy path */ c => this.candidates = c,
         /* error path */ e => this.errorMessage = e);
  }

  getWorkflows(): void {
    this.workflowsProvider.getAll().subscribe(
         /* happy path */ w => this.workflows = w,
         /* error path */ e => this.errorMessage = e);
  }

  getUrl(candidate: Candidate): string {
    return `https://maps.googleapis.com/maps/api/streetview?size=640x480&location=${candidate.lat},${candidate.lng}&heading=${candidate.heading}&pitch=${candidate.pitch}&fov=120&key=${constants.googleKey}`;
  }

  ngOnInit(): void {
    this.getCandidates();
    this.getWorkflows();
  }

  getTask(question: number): Task {
    return _.find(_.first(this.workflows).tasks, { "id": question });
  }

  canShowMessages(candidate: Candidate): boolean {
    let m = _.find(this.displayMessages, (x) => {
      return x[0] === candidate.id;
    });
    return !_.isUndefined(m) && m[1];
  }

  showMessages(candidate: Candidate) {
    let m = _.find(this.displayMessages, (x) => {
      return x[0] === candidate.id;
    });
    if (_.isUndefined(m)) {
      this.displayMessages.push([candidate.id, true]);
    } else {
      m[1] = true;
    }
  }
}
