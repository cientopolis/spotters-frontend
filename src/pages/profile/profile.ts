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

  constructor(public navCtrl: NavController, public auth: AuthService, private userProvider: UserProvider) {
    
  }

  ionViewDidLoad() {
    this.auth.lock.on('authenticated', () => {
      console.log('successfully signed in!');
      this.userProvider.tutorialComplete().subscribe(
        c => {
          if (this.auth.authenticated() && c === false) {
            console.log('tutorial');
            this.navCtrl.push(TutorialPage);
          }
        },
        e => console.log(e));
    });
  }
}
