import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Candidate } from '../../models/candidate';
import { Workflow } from '../../models/workflow';
import { Task } from '../../models/task';
import { constants } from '../../app/app.constants';
import _ from 'lodash';

@Component({
  selector: 'candidate-card',
  templateUrl: 'candidate-card.html'
})
export class CandidateCardComponent {
  @Input() candidate: Candidate;
  @Input() workflow: Workflow;
  @Input() expert: boolean = false;
  displayMessages: boolean = false;
  displayPanorama: boolean = false;
  errorMessage: string = '';

  constructor(private auth: AuthService) {

  }

  getUrl(candidate: Candidate): string {
    return `https://maps.googleapis.com/maps/api/streetview?size=640x480&location=${candidate.lat},${candidate.lng}&heading=${candidate.heading}&pitch=${candidate.pitch}&fov=120&key=${constants.googleKey}`;
  }

  getTask(question: number): Task {
    return JSON.parse(_.find(this.workflow.tasks, { "id": question }).content);
  }

  toggleMessages() {
    this.displayMessages = !this.displayMessages;
  }

  toggleMap() {
    this.displayPanorama = !this.displayPanorama;
    if (this.displayPanorama) {
      let height = document.getElementById(`picture${this.candidate.id}`).clientHeight;
      document.getElementById(`streetview_${this.candidate.id}`).style.height = `${height}px`;
    } else {
      document.getElementById(`streetview_${this.candidate.id}`).style.height = `0px`;
    }
  }
}