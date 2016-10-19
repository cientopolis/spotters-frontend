import { Workflow } from '../../providers/workflow';
import { WorkflowsProvider } from '../../providers/workflows.provider';
import { Task } from '../../providers/task';

import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

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
  current_task: Task;
  initialice_workflow: Boolean;
  workflow: Workflow;

  constructor(public navCtrl: NavController, private configurationProvider: ConfigurationProvider, public currentLocation: CurrentLocationService, private workflowProvider: WorkflowsProvider) {

  }

  public capture(): void {
    this.initialice_workflow = true;
  }

  /*public setPanorama(): void {
    this.panorama = new google.maps.StreetViewPanorama(document.getElementById('streetview2'), {
      position: new google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng),
      pov: {
        heading: this.currentLocation.heading,
        pitch: this.currentLocation.pitch
      }
    });
  }

  public getConfiguration(): void {
    this.configurationProvider.getAll().subscribe(
      c => {
        this.configuration = _.first(c);
        if (this.currentLocation.isBlank()) {
          this.currentLocation.lat = this.configuration.lat;
          this.currentLocation.lng = this.configuration.lng;
          this.currentLocation.heading = this.configuration.headingCenter;
          this.currentLocation.pitch = this.configuration.pitchCenter;
          this.currentLocation.refresh = true;
        }

        this.setPanorama();
      },
      e => this.errorMessage = e);
  }

  public getWorkflow(): void {

  }*/

  /*public getNextTask(current): void {
    let task = _.find(this.tasks, task => {
      return task.id == 3
    });

    this.current_task = task;
  }*/

  ngOnInit(): void {
    // this.initialice_workflow = false;
    // this.getConfiguration();

    /*this.workflowProvider.getAll().subscribe(
      w => {
        this.workflow = _.first(w);
        this.current_task = this.workflow.firstTask;
        // this.current_task = _.first(this.tasks);
        //console.log(this.current_task);
        //console.log('ahora');
        //console.log(this.current_task.widgetType)
      })*/
  }
}
