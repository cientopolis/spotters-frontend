import { Workflow } from '../../models/workflow';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Task } from '../../models/task';
import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Configuration } from '../../models/configuration';

import { ModalController } from 'ionic-angular';
import { ModalContentPage } from '../../components/workflow/modal';

import _ from "lodash";
declare var google: any;

@Component({
  selector: 'page-panorama',
  templateUrl: 'panorama.html',
  providers: [WorkflowsProvider]
})
export class PanoramaPage {
  panorama: any;
  configuration: Configuration;
  errorMessage: string;
  @Input() current_task: Task;
  workflow: Workflow;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public currentLocation: CurrentLocationService, private workflowProvider: WorkflowsProvider) {

  }

  initialiceWorkflow() {
    let modal = this.modalCtrl.create(ModalContentPage, { charNum: 1 });
    modal.present();
  }
}