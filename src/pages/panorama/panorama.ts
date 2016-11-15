import { Workflow } from '../../models/workflow';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Task } from '../../models/task';

import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Component } from '@angular/core';
import { OnInit, Input } from '@angular/core';

import { NavController } from 'ionic-angular';

import { Configuration } from '../../models/configuration';
import { ConfigurationProvider } from '../../providers/configuration.provider';

import { Candidate } from '../../models/candidate';
import { CandidatesProvider } from '../../providers/candidates.provider';

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
  initialice_workflow: boolean;
  workflow: Workflow;

  private classification: {
    data: any;
  };

  constructor(public navCtrl: NavController, private configurationProvider: ConfigurationProvider, public currentLocation: CurrentLocationService, private workflowProvider: WorkflowsProvider, private candidatesProvider: CandidatesProvider) {
    this.classification = {
      data: new Array()
    }
  }

  public capture(): void {
    this.initialice_workflow = true;
  }

  public next(): void {

  }

  public nextQuestion($event) {
    if (this.current_task.multiple) {
      this.classification.data.push({
        question: this.current_task.id,
        answer: new Array()
      });

      //como es multiple, itero los valores y se los añado
      _.each($event.value, (value) => {
        this.classification.data[this.classification.data.length - 1].answer.push(value);
      });
    }
    else {
      //Como no es multiple, el valor devuelto es un String
      this.classification.data.push({
        question: this.current_task.id,
        answer: $event.value
      });
    }

    //Una vez armado la classification verifico si es el ultimo para ya persistirlo
    if (_.isUndefined($event.next)) {
      console.log('Persistiendo clasificacion ...');
      this.candidatesProvider.create(this.currentLocation.getLng(), this.currentLocation.getLat(), this.currentLocation.getHeading(), this.currentLocation.getPitch())
        .subscribe(
        c => console.log(c),
        e => { }
        )
    }
    else {
      let task_index = _.findIndex(this.workflow.tasks, (task) => {
        return task.id == $event.next;
      })
      this.current_task = this.workflow.tasks[task_index];
    }
  }

  public checkTypeInput() {
    //FIXME: current_task no espera el ngOnInit y es undefined (seguramente porque ngOnInit llama a una promisse)
    if (this.current_task) {
      if (this.current_task.multiple) {
        return 'radio';
      }
      else {
        if (this.current_task.widget_type == 'choice') {
          return 'choice';
        }
        else {
          return 'input';
        }
      }
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
