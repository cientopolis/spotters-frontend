import { Component, Input } from '@angular/core';
import { Candidate } from '../../models/candidate';
import { Classification } from '../../models/classification';
import { Workflow } from '../../models/workflow';

@Component({
  selector: 'classification-list',
  templateUrl: 'classification-list.html'
})
export class ClassificationListComponent {
  @Input() candidate: Candidate;
  @Input() classifications: Classification[];
  @Input() workflow: Workflow;
}