import { Component, OnInit, Input } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

import { Workflow } from '../../models/workflow';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Task } from '../../models/task';
import _ from "lodash";
import { CandidatesProvider } from '../../providers/candidates.provider';
import { CurrentLocationService } from '../../utils/currentLocation.service';

@Component({
    templateUrl: 'modal.html',
})
export class ModalContentPage implements OnInit {
    character;
    workflow: Workflow;
    @Input() current_task: Task;
    private classification: {
        data: any;
    };

    constructor(
        private workflowProvider: WorkflowsProvider,
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        private candidatesProvider: CandidatesProvider,
        public currentLocation: CurrentLocationService
    ) {
        this.classification = {
            data: new Array()
        }
    }

    dismiss() {
        this.viewCtrl.dismiss();
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
            let location = this.currentLocation.getLocation();
            this.candidatesProvider.create(location.lng, location.lat, location.heading, location.pitch)
                .subscribe(
                c => {
                    this.dismiss();
                },
                e => {
                    console.log('Ocurrio un error al persistir al candidato ...');
                    this.dismiss();
                }
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
        this.workflowProvider.getAll().subscribe(
            w => {
                this.workflow = _.first(w);
                this.current_task = this.workflow.first_task;
            })
    }
}