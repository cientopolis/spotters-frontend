import { Component, OnInit } from '@angular/core';
import { CandidatesProvider } from '../../providers/candidates.provider';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Candidate } from '../../models/candidate';
import { Workflow } from '../../models/workflow';
import { Configuration } from '../../models/configuration';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import _ from 'lodash';

@Component({
  selector: 'page-expert',
  templateUrl: 'expert.html'
})
export class ExpertPage implements OnInit {
  status: string = 'active';
  candidates: Candidate[];
  workflow: Workflow;
  errorMessage: string = '';
  configuration: Configuration;
  subscription: Subscription;
  expert: boolean = true;

  constructor(public navCtrl: NavController, private candidatesProvider: CandidatesProvider, private workflowsProvider: WorkflowsProvider) {

  }

  getCandidates(): void {
    this.candidatesProvider.getAll({status: this.status}).subscribe(
         /* happy path */ c => this.candidates = c,
         /* error path */ e => this.errorMessage = e);
  }

  getWorkflows(): void {
    this.workflowsProvider.getAll().subscribe(
         /* happy path */ w => this.workflow = _.first(w),
         /* error path */ e => this.errorMessage = e);
  }

  ngOnInit(): void {
    this.getWorkflows();
    this.getCandidates();
  }
}
