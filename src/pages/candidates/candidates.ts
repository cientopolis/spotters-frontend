import { Component } from '@angular/core';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Candidate } from '../../models/candidate';
import { Workflow } from '../../models/workflow';
import { Configuration } from '../../models/configuration';
import { NavController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import _ from 'lodash';

@Component({
  selector: 'page-candidates',
  templateUrl: 'candidates.html'
})
export class CandidatesPage {
  candidates: Candidate[];
  workflow: Workflow;
  errorMessage: string = '';
  configuration: Configuration;
  subscription: Subscription;

  constructor(public navCtrl: NavController, public currentLocationService: CurrentLocationService, private workflowsProvider: WorkflowsProvider) {
    this.getWorkflows();
  }

  getWorkflows(): void {
    this.workflowsProvider.getAll().subscribe(
      w => {
        this.workflow = _.first(w);
        this.currentLocationService.candidates$.subscribe(
          candidates => this.candidates = candidates);
      },
      e => this.errorMessage = e);
  }
}
