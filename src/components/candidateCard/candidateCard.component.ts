import { Component, Input } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { CandidatesProvider } from '../../providers/candidates.provider';
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
  @Input() candidate: Candidate = null;
  @Input() workflow: Workflow = null;
  @Input() expert: boolean = false;
  displayMessages: boolean = false;
  displayPanorama: boolean = false;
  displayNewClassification: boolean = false;
  errorMessage: string = '';

  constructor(public actionSheetCtrl: ActionSheetController, private auth: AuthService, private candidatesProvider: CandidatesProvider) {

  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Clasificación',
      buttons: [
        {
          text: 'Descartar',
          role: 'destructive',
          handler: () => {
            this.candidatesProvider.setStatus(this.candidate, 'discarded').subscribe(
              c => {
                this.candidate = c;
              },
              e => this.errorMessage = e
            );
          }
        }, {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => { }
        }
      ]
    });
    actionSheet.present();
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

  toggleNewClassification() {
    this.displayNewClassification = !this.displayNewClassification;
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
