import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Configuration } from '../../models/configuration';

import { ModalController } from 'ionic-angular';
import { ModalContentPage } from '../../components/workflow/modal';

declare var google: any;

@Component({
  selector: 'page-panorama',
  templateUrl: 'panorama.html'
})
export class PanoramaPage {
  panorama: any;
  configuration: Configuration;
  errorMessage: string;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public currentLocation: CurrentLocationService) {

  }

  initializeWorkflow() {
    let modal = this.modalCtrl.create(ModalContentPage, {
      location: this.currentLocation.getLocation()
    });
    modal.present();
  }
}