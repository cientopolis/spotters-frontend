import { Component, OnInit, Input } from '@angular/core';
import { Platform, NavParams, ViewController } from 'ionic-angular';

import { Workflow } from '../../models/workflow';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Task } from '../../models/task';

import { CandidatesProvider } from '../../providers/candidates.provider';
import { ClassificationsProvider } from '../../providers/classifications.provider';
import { CurrentLocationService } from '../../utils/currentLocation.service';
import { constants } from '../../app/app.constants';
import { Location } from '../../models/location';
import { Candidate } from '../../models/candidate';
import { ToastController } from 'ionic-angular';

import _ from "lodash";

@Component({
    templateUrl: 'modal.html',
})
export class ModalContentPage implements OnInit {
    workflow: Workflow;
    location: Location = null;
    candidate: Candidate = null;
    @Input() current_task: Task;
    classification: {
        data: any;
    };

    constructor(
        private workflowProvider: WorkflowsProvider,
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        private candidatesProvider: CandidatesProvider,
        public currentLocation: CurrentLocationService,
        private classificationsProvider: ClassificationsProvider,
        public toastCtrl: ToastController
    ) {
        this.classification = {
            data: []
        };

        this.location = this.params.get('location');
        this.candidate = this.params.get('candidate');
    }

    dismiss(status: boolean) {
        let message = (status) ? 'Clasificacion agregada correctamente' : 'Ha ocurrido un error!'
        const toast = this.toastCtrl.create({
            message: message,
            showCloseButton: true,
            closeButtonText: 'Aceptar'
        });
        toast.present();
        this.viewCtrl.dismiss();
    }

    createClassification(candidate: Candidate) {
        this.classificationsProvider
            .create(candidate, this.classification.data)
            .subscribe(
                classification => {
                    this.dismiss(true);
                },
                e => {
                    console.log('Ocurrio un error al crear la clasificacion para el candidato');
                    console.log(e);
                    this.dismiss(false);
                }
            )
    }

    public nextQuestion($event) {
        if (this.current_task.multiple) {
            this.classification.data.push({
                question: this.current_task.id,
                answer: []
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
            if (!_.isNil(this.location)) {
                this.candidatesProvider.create(this.location.lng, this.location.lat, this.location.heading, this.location.pitch)
                    .subscribe(
                    c => {
                        //Obtenido el candidato, persisto la clasificacion
                        this.createClassification(c);
                    }, e => {
                        console.log('Ocurrio un error al persistir al candidato ...');
                        this.dismiss(false);
                    });
            } else if (!_.isNil(this.candidate)) {
                // Crear la clasificación
                this.createClassification(this.candidate);
            }
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
            } else {
                if (this.current_task.widget_type == 'choice') {
                    return 'choice';
                } else {
                    return 'input';
                }
            }
        }
    }

    getUrl(): string {
        let d = _.isNil(this.location) ? this.candidate : this.location;
        if (!_.isNil(d)) {
            return `https://maps.googleapis.com/maps/api/streetview?size=640x480&location=${d.lat},${d.lng}&heading=${d.heading}&pitch=${d.pitch}&fov=120&key=${constants.googleKey}`;
        } else {
            return '';
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