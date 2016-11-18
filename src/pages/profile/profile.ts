import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { ExpertPage } from '../expert/expert';
import { TutorialPage } from '../tutorial/tutorial';
import { UserProvider } from '../../providers/user.provider';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  expertPage = ExpertPage;
  tutorialPage = TutorialPage;
  isExpert: boolean = false;

  constructor(public navCtrl: NavController, public auth: AuthService, private userProvider: UserProvider) {
    this.userProvider.isExpert().subscribe(
        e => this.isExpert = e,
        e => console.log(e));
  }

  ionViewDidLoad() {
    this.auth.lock.on('authenticated', () => {
      this.userProvider.tutorialComplete().subscribe(
        c => {
          if (this.auth.authenticated() && c === false) {
            this.navCtrl.push(TutorialPage);
          }
        },
        e => console.log(e));
    });
  }
}
