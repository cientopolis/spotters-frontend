import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth/auth.service';
import { TutorialStep } from '../../models/tutorialStep';
import { TutorialStepsProvider } from '../../providers/tutorialSteps.provider';
import { UserProvider } from '../../providers/user.provider';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html'
})
export class TutorialPage implements OnInit {
  tutorialSteps: TutorialStep[];
  errorMessage: string;

  constructor(public navCtrl: NavController, private auth: AuthService, private tutorialStepsProvider: TutorialStepsProvider, private userProvider: UserProvider) { }

  finishTutorial() {
    if (this.auth.authenticated()) {
      this.userProvider.tutorial().subscribe(
        c => {
          if (c) {
            this.navCtrl.pop();
          }
        },
        e => this.errorMessage = e);
    } else {
      this.navCtrl.pop();
    }
  }

  getTutorialSteps(): void {
    this.tutorialStepsProvider.getAll().subscribe(
      ts => this.tutorialSteps = ts,
      e => this.errorMessage = e);
  }

  ngOnInit(): void {
    this.getTutorialSteps();
  }
}
