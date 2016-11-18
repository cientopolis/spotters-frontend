import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { CandidatesProvider } from '../../providers/candidates.provider';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Candidate } from '../../models/candidate';
import { Workflow } from '../../models/workflow';
import { Configuration } from '../../models/configuration';
import _ from 'lodash';

@Component({
  selector: 'page-candidates',
  templateUrl: 'candidates.html'
})
export class CandidatesPage implements OnInit {
  own: boolean = false;
  candidates: Candidate[] = [];
  workflow: Workflow = null;
  errorMessage: string = '';
  configuration: Configuration = null;

  constructor(private navParams: NavParams, public navCtrl: NavController, public currentLocationService: CurrentLocationService, public auth: AuthService, private candidatesProvider: CandidatesProvider, private workflowsProvider: WorkflowsProvider) {
    this.own = navParams.get('own');
  }

  getWorkflows(): void {
    this.workflowsProvider.getAll().subscribe(
      w => {
        this.workflow = _.first(w);
        if (!this.own) {
          this.currentLocationService.candidates$.subscribe(
            candidates => this.candidates = candidates);
        } else {
          console.log(this.auth.user);
          this.candidatesProvider.getOwn((this.auth.user as any).user_id).subscribe(
            candidates => this.candidates = candidates);
        }
      },
      e => this.errorMessage = e);
  }

  ngOnInit() {
    this.getWorkflows();
  }
}
