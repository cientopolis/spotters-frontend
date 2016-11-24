import { Component, Input, OnInit } from '@angular/core';
import { Candidate } from '../../models/candidate';
import { Classification } from '../../models/classification';
import { Workflow } from '../../models/workflow';
import _ from 'lodash';

@Component({
  selector: 'classification-list',
  templateUrl: 'classification-list.html'
})
export class ClassificationListComponent implements OnInit {
  @Input() candidate: Candidate = null;
  @Input() classifications: Classification[] = [];
  @Input() workflow: Workflow = null;
  @Input() expert: boolean = false;

  calculatePositiveVotes(classification: Classification): number {
    return _.filter(classification.votes, { 'positive': true }).length;
  }

  calculateNegativeVotes(classification: Classification): number {
    return _.filter(classification.votes, { 'positive': false }).length;
  }

  ngOnInit() {
    this.classifications = _.orderBy(this.classifications, (classification) => {
      return this.calculatePositiveVotes(classification) - this.calculateNegativeVotes(classification);
    }, ['desc']);
  }
}
