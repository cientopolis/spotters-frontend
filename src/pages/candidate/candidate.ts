import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CandidatesProvider } from '../../providers/candidates.provider';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Candidate } from '../../models/candidate';
import { Workflow } from '../../models/workflow';
import { Configuration } from '../../models/configuration';
import _ from 'lodash';

@Component({
  selector: 'page-candidate',
  templateUrl: 'candidate.html'
})
export class CandidatePage implements OnInit {
  id: number = null;
  candidate: Candidate = null;
  workflow: Workflow = null;
  errorMessage: string = '';
  configuration: Configuration = null;

  constructor(private navParams: NavParams, public navCtrl: NavController, private candidatesProvider: CandidatesProvider, private workflowsProvider: WorkflowsProvider) {
    this.id = navParams.get('id');
  }

  getWorkflows(): void {
    this.workflowsProvider.getAll().subscribe(
      w => {
        this.workflow = _.first(w);
        if (!_.isNil(this.id)) {
          this.candidatesProvider.getById(this.id).subscribe(
            c => {
              this.candidate = c;
            },
            e => this.errorMessage = e
          )
        }
      },
      e => this.errorMessage = e);
  }

  ngOnInit() {
    this.getWorkflows();
  }
}
