import { Workflow } from '../../providers/workflow';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Task } from '../../providers/task';

import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Component } from '@angular/core';
import { OnInit, Input } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Configuration } from '../../providers/configuration';
import { ConfigurationProvider } from '../../providers/configuration.provider';

import _ from "lodash";

declare var google: any;

@Component({
  selector: 'page-panorama',
  templateUrl: 'panorama.html',
  providers: [ConfigurationProvider, WorkflowsProvider]
})
export class PanoramaPage implements OnInit {
  panorama: any;
  configuration: Configuration;
  errorMessage: string;
  @Input() current_task: Task;
  initialice_workflow: Boolean;
  workflow: Workflow;

  constructor(public navCtrl: NavController, private configurationProvider: ConfigurationProvider, public currentLocation: CurrentLocationService, private workflowProvider: WorkflowsProvider) {

  }

  public capture(): void {
    this.initialice_workflow = true;
  }

  public next(): void {

  }

  public nextQuestion(nextId: Number) {
    this.current_task = this.workflow.tasks[0];
  }

  public checkTypeInput() {
    if (this.current_task && this.current_task.id == 3) {
      return 'choice';
    }
    else {
      return 'choice';
    }
  }

  ngOnInit(): void {
    this.initialice_workflow = false;

    this.workflowProvider.getAll().subscribe(
      w => {
        this.workflow = _.first(w);
        this.current_task = this.workflow.first_task;
      })
  }
}
