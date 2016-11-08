import { Component, OnInit } from '@angular/core';
import { CandidatesProvider } from '../../providers/candidates.provider';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { ConfigurationProvider } from '../../providers/configuration.provider';
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
export class CandidatesPage implements OnInit {
  candidates: Candidate[];
  workflow: Workflow;
  errorMessage: string = '';
  configuration: Configuration;
  subscription: Subscription;

  constructor(public navCtrl: NavController, private candidatesProvider: CandidatesProvider, private configurationProvider: ConfigurationProvider, public currentLocationService: CurrentLocationService, private workflowsProvider: WorkflowsProvider) {
    this.subscription = currentLocationService.refresh$.subscribe(
      refresh => {
        if (refresh) {
          currentLocationService.setRefresh(false);
          this.getCandidates();
        }
      });
  }

  getCandidates(): void {
    this.candidatesProvider.getAll({ lat: this.currentLocationService.getLat(), lng: this.currentLocationService.getLng() }).subscribe(
         /* happy path */ c => this.candidates = c,
         /* error path */ e => this.errorMessage = e);
  }

  getWorkflows(): void {
    this.workflowsProvider.getAll().subscribe(
         /* happy path */ w => this.workflow = _.first(w),
         /* error path */ e => this.errorMessage = e);
  }

  getConfiguration(): void {
    this.configurationProvider.getAll().subscribe(
      c => {
        this.configuration = _.first(c);
        if (this.currentLocationService.isBlank()) {
          this.currentLocationService.setLat(this.configuration.lat);
          this.currentLocationService.setLng(this.configuration.lng);
          this.currentLocationService.setHeading(this.configuration.headingCenter);
          this.currentLocationService.setPitch(this.configuration.pitchCenter);
          this.currentLocationService.setRefresh(true);
        }
        this.getCandidates();
      },
      e => this.errorMessage = e);
  }

  ngOnInit(): void {
    this.getWorkflows();
    this.getConfiguration();
  }
}
