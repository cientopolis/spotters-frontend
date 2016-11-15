import { Component, Input, OnInit } from '@angular/core';
import { ActionSheetController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { ClassificationsProvider } from '../../providers/classifications.provider';
import { ClassificationVotesProvider } from '../../providers/classificationVotes.provider';
import { Candidate } from '../../models/candidate';
import { Classification } from '../../models/classification';
import { Workflow } from '../../models/workflow';
import { Task } from '../../models/task';
import _ from 'lodash';

@Component({
  selector: 'classification-item',
  templateUrl: 'classification-item.html'
})
export class ClassificationItemComponent implements OnInit {
  @Input() candidate: Candidate = null;
  @Input() classification: Classification = null;
  @Input() workflow: Workflow = null;
  @Input() expert: boolean = false;
  positiveVotes: number = 0;
  negativeVotes: number = 0;
  userVoted: boolean = false;
  errorMessage: string = '';

  constructor(public actionSheetCtrl: ActionSheetController, public auth: AuthService, private classificationsProvider: ClassificationsProvider, private classificationVotesProvider: ClassificationVotesProvider) {

  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Clasificación',
      buttons: [
        {
          text: 'Confirmar',
          handler: () => {
            this.classificationsProvider.setStatus(this.candidate, this.classification, 'confirmed').subscribe(
              c => {
                this.classification = c;
                this.calculateVotes();
              },
              e => this.errorMessage = e
            );
          }
        }, {
          text: 'Rechazar',
          role: 'destructive',
          handler: () => {
            this.classificationsProvider.setStatus(this.candidate, this.classification, 'rejected').subscribe(
              c => {
                this.classification = c;
                this.calculateVotes();
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

  getTask(question: number): Task {
    return _.find(this.workflow.tasks, { "id": question }).content;
  }

  vote(vote: boolean) {
    this.classificationVotesProvider.create(this.candidate, this.classification, vote).subscribe(
      v => {
        this.classification.votes.push(v);
        this.calculateVotes();
      },
      e => this.errorMessage = e
    )
  }

  calculateVotes() {
    this.positiveVotes = _.filter(this.classification.votes, { 'positive': true }).length;
    this.negativeVotes = this.classification.votes.length - this.positiveVotes;
    this.userVoted = this.auth.authenticated() && !_.isUndefined(_.find(this.classification.votes, v => {
      return v.user.sub === (this.auth.user as any).user_id; // Corregir este hack
    }));
  }

  ngOnInit(): void {
    this.calculateVotes();
  }
}