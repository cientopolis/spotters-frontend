import { Component, Input } from '@angular/core';
import { Candidate } from '../../models/candidate';
import { Classification } from '../../models/classification';
import { Workflow } from '../../models/workflow';
import _ from 'lodash';

@Component({
  selector: 'classification-list',
  templateUrl: 'classification-list.html'
})
export class ClassificationListComponent {
  @Input() candidate: Candidate = null;

  _classifications: Classification[] = [];

  @Input()
  set classifications(classifications: Classification[]) {
    this._classifications = _.orderBy(classifications, (classification) => {
      return this.calculatePositiveVotes(classification) - this.calculateNegativeVotes(classification);
    }, ['desc']);
  }

  get classifications(): Classification[] {
    return this._classifications;
  }

  @Input() workflow: Workflow = null;
  @Input() expert: boolean = false;

  calculatePositiveVotes(classification: Classification): number {
    return _.filter(classification.votes, { 'positive': true }).length;
  }

  calculateNegativeVotes(classification: Classification): number {
    return _.filter(classification.votes, { 'positive': false }).length;
  }
}
