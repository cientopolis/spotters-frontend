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
    console.log('La siguiente pregunta es ' + nextId);

    this.current_task = this.workflow.tasks[0];

    console.log('la siguiente pregunta es');
    console.log(this.workflow.tasks[0]);

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
