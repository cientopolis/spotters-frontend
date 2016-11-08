import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
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
  @Input() candidate: Candidate;
  @Input() classification: Classification;
  @Input() workflow: Workflow;
  positiveVotes: number = 0;
  negativeVotes: number = 0;
  userVoted: boolean = false;
  errorMessage: string = '';

  constructor(private auth: AuthService, private classificationVotesProvider: ClassificationVotesProvider) {

  }

  getTask(question: number): Task {
    return JSON.parse(_.find(this.workflow.tasks, { "id": question }).content);
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
    this.userVoted = !_.isUndefined(_.find(this.classification.votes, v => {
      return v.user.sub === (this.auth.user as any).user_id; // Corregir este hack
    }));
  }

  ngOnInit(): void {
    this.calculateVotes();
  }
}