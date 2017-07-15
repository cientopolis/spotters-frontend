import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { CandidatesPage } from '../candidates/candidates';
import { ExpertPage } from '../expert/expert';
import { TutorialPage } from '../tutorial/tutorial';
import { Configuration } from '../../models/configuration';
import { Badge } from '../../models/badge';
import { BadgesProvider } from '../../providers/badges.provider';
import { UserProvider } from '../../providers/user.provider';
import { CurrentLocationService } from '../../utils/currentLocation.service';
import _ from 'lodash';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  candidatesPage = CandidatesPage;
  expertPage = ExpertPage;
  tutorialPage = TutorialPage;
  configuration: Configuration = null;
  isExpert: boolean = false;
  errorMessage: string = '';
  badges: Badge[] = [];

  constructor(public navCtrl: NavController, public auth: AuthService, private currentLocation: CurrentLocationService, private userProvider: UserProvider, private badgesProvider: BadgesProvider) {
    this.userProvider.isExpert().subscribe(
      e => this.isExpert = e,
      e => this.errorMessage = e);
    currentLocation.configuration$.subscribe(
      c => {
        if (!_.isNil(c)) {
          this.configuration = c;
        }
      });
  }

  ionViewDidEnter() {
    this.auth.lock.on('authenticated', () => {
      this.userProvider.tutorialComplete().subscribe(
        c => {
          if (this.auth.authenticated() && c === false) {
            this.navCtrl.push(TutorialPage);
          }
        },
        e => console.log(e));
    });

    this.badgesProvider.getAll().subscribe(
      b => this.badges = b,
      e => console.log(e));
  }
}
