import { Component, OnInit } from '@angular/core';
import { CandidatesProvider } from '../../providers/candidates.provider';
import { UserProvider } from '../../providers/user.provider';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Candidate } from '../../models/candidate';
import { Workflow } from '../../models/workflow';
import { Configuration } from '../../models/configuration';
import { NavController } from 'ionic-angular';
import _ from 'lodash';

@Component({
  selector: 'page-expert',
  templateUrl: 'expert.html'
})
export class ExpertPage implements OnInit {
  status: string = 'active';
  candidates: Candidate[] = [];
  workflow: Workflow = null;
  errorMessage: string = '';
  configuration: Configuration = null;
  expert: boolean = true;

  constructor(public navCtrl: NavController, private candidatesProvider: CandidatesProvider, private userProvider: UserProvider, private workflowsProvider: WorkflowsProvider) {

  }

  getCandidates(): void {
    this.candidatesProvider.getAll({ status: this.status }).subscribe(
      c => this.candidates = c,
      e => this.errorMessage = e);
  }

  getWorkflows(): void {
    this.workflowsProvider.getAll().subscribe(
      w => this.workflow = _.first(w),
      e => this.errorMessage = e);
  }

  ngOnInit(): void {
    this.getWorkflows();
    this.getCandidates();
    this.userProvider.isExpert().subscribe(
      e => {
        this.expert = e;
        if (!this.expert) {
          this.navCtrl.pop();
        }
      },
      e => console.log(e));
  }
}
