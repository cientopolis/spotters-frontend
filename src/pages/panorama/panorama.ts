import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Panorama page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-panorama',
  templateUrl: 'panorama.html'
})
export class PanoramaPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello Panorama Page');
  }

}
