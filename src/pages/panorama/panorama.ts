import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Configuration } from '../../models/configuration';

import { ModalController } from 'ionic-angular';
import { ModalContentPage } from '../../components/workflow/modal';
import inside from 'point-in-polygon';
import _ from 'lodash';

declare var google: any;

@Component({
  selector: 'page-panorama',
  templateUrl: 'panorama.html'
})
export class PanoramaPage {
  panorama: any;
  configuration: Configuration;
  polygon: any[] = [];
  errorMessage: string;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public currentLocation: CurrentLocationService) {
    currentLocation.configuration$.subscribe(
      c => {
        if (!_.isNil(c)) {
          this.configuration = c;
          _.each(this.configuration.bounds, p => {
            this.polygon.push([p.lng, p.lat]);
          });
        }
      });
  }

  insideBounds(): boolean {
    let point = [this.currentLocation.getLocation().lng, this.currentLocation.getLocation().lat];
    return inside(point, this.polygon);
  }

  initializeWorkflow() {
    if (this.insideBounds()) {
      let modal = this.modalCtrl.create(ModalContentPage, {
        location: this.currentLocation.getLocation()
      });
      modal.present();
    }
  }
}