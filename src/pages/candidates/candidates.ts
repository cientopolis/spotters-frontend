import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { CandidatesProvider } from '../../providers/candidates.provider'
import { MessagesProvider } from '../../providers/messages.provider'
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { ConfigurationProvider } from '../../providers/configuration.provider';
import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Candidate } from '../../providers/candidate';
import { Workflow } from '../../providers/workflow';
import { Task } from '../../providers/task';
import { Configuration } from '../../providers/configuration';
import { constants } from '../../app/app.constants';
import { NavController } from 'ionic-angular';
import _ from 'lodash';

@Component({
  selector: 'page-candidates',
  templateUrl: 'candidates.html'
})
export class CandidatesPage implements OnInit {
  candidates: Candidate[];
  workflow: Workflow;
  displayMessages: [number, boolean][] = [];
  errorMessage: string = '';
  configuration: Configuration;

  constructor(public navCtrl: NavController, private auth: AuthService, private candidatesProvider: CandidatesProvider, private messagesProvider: MessagesProvider, private configurationProvider: ConfigurationProvider, public currentLocationService: CurrentLocationService, private workflowsProvider: WorkflowsProvider) {

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

  getUrl(candidate: Candidate): string {
    return `https://maps.googleapis.com/maps/api/streetview?size=640x480&location=${candidate.lat},${candidate.lng}&heading=${candidate.heading}&pitch=${candidate.pitch}&fov=120&key=${constants.googleKey}`;
  }

  ngOnInit(): void {
    this.getWorkflows();
    this.getConfiguration();
  }

  getTask(question: number): Task {
    return JSON.parse(_.find(this.workflow.tasks, { "id": question }).content);
  }

  canShowMessages(candidate: Candidate): boolean {
    let m = _.find(this.displayMessages, (x) => {
      return x[0] === candidate.id;
    });
    return !_.isUndefined(m) && m[1];
  }

  toggleMessages(candidate: Candidate) {
    let m = _.find(this.displayMessages, (x) => {
      return x[0] === candidate.id;
    });
    if (_.isUndefined(m)) {
      this.displayMessages.push([candidate.id, true]);
    } else {
      m[1] = !m[1];
    }
  }

  sendMessage(candidate: Candidate, message: string) {
    this.messagesProvider.create(candidate, message).subscribe(
      m => candidate.messages.push(m),
      e => this.errorMessage = e
    )
  }
}
