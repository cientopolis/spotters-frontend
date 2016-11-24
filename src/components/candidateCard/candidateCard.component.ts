import { Component, Input, NgZone, OnInit } from '@angular/core';
import { ActionSheetController, ModalController, Platform } from 'ionic-angular';
import { SocialSharing } from 'ionic-native';
import { AuthService } from '../../services/auth/auth.service';
import { CandidatesProvider } from '../../providers/candidates.provider';
import { Candidate } from '../../models/candidate';
import { Classification } from '../../models/classification';
import { Workflow } from '../../models/workflow';
import { Task } from '../../models/task';
import { constants } from '../../app/app.constants';
import { ModalContentPage } from '../workflow/modal';
import _ from 'lodash';

@Component({
  selector: 'candidate-card',
  templateUrl: 'candidate-card.html'
})
export class CandidateCardComponent implements OnInit {
  @Input() candidate: Candidate = null;
  @Input() workflow: Workflow = null;
  @Input() expert: boolean = false;
  classifications: Classification[] = [];
  displayMessages: boolean = false;
  displayPanorama: boolean = false;
  displayNewClassification: boolean = false;
  errorMessage: string = '';

  constructor(public _zone: NgZone, public platform: Platform, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController, private auth: AuthService, private candidatesProvider: CandidatesProvider) {

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

  initializeWorkflow() {
    let modal = this.modalCtrl.create(ModalContentPage, {
      candidate: this.candidate
    });
    modal.onDidDismiss(data => {
      if (!_.isNil(data.classification)) {
        this.candidate.classifications.push(data.classification);
        this._zone.run(() => {
          this.classifications = this.candidate.classifications;
        });
      }
    });
    modal.present();
  }

  share() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        SocialSharing.share(`Punto de interés localizado en ${this.candidate.lat} - ${this.candidate.lng}`, null, this.getUrl(this.candidate), `${constants.domain}/#/candidates/${this.candidate.id}`);
      }
    });
  }

  ngOnInit() {
    this.classifications = this.candidate.classifications;
  }
}
