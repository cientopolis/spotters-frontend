import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AuthService} from '../../services/auth/auth.service';

/*
  Generated class for the Profile page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  choice: string;

  constructor(public navCtrl: NavController, public auth: AuthService) {}

  ionViewDidLoad() {
    console.log('Hello Profile Page');
  }

}
