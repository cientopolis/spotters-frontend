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
  initialice_workflow: boolean;
  workflow: Workflow;

  private classification: {
        data: {
          question: number,
          answer: any //Puede ser un String o un arreglo de String si es multiple, por eso recibe Any;
        }[]
    };

  constructor(public navCtrl: NavController, private configurationProvider: ConfigurationProvider, public currentLocation: CurrentLocationService, private workflowProvider: WorkflowsProvider) {
 
  }

  public capture(): void {
    this.initialice_workflow = true;
  }

  public next(): void {

  }

  public nextQuestion($event) {
    //Como tengo next_question, persisto los datos y despues cambio current_task

    this.classification.data.push({
      question: this.current_task.id,
      answer: ''
    })
    console.log($event.value);
    if (this.current_task.multiple) {
      //como es multiple, itero los valores y se los añado
      _.each($event.value, (value) => {
        console.log(value);
        //this.classification.data[this.classification.data.length() - 1].answer.push(value);
      });
    }
    else {
      //Como no es multiple, el valor devuelto es un String
      this.classification.data[0].answer = $event.value;
    }

    let task_index = _.findIndex(this.workflow.tasks, (task) => {
      return task.id == $event.next;
    })
    this.current_task = this.workflow.tasks[task_index];
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
