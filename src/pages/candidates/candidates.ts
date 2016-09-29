import { Component, OnInit } from '@angular/core';
import { CandidatesProvider } from '../../providers/candidates.provider'
import { Candidate } from '../../providers/candidate'
import { constants } from '../../app/app.constants';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-candidates',
  templateUrl: 'candidates.html'
})
export class CandidatesPage implements OnInit {
  candidates: Candidate[];
  errorMessage: string = '';

  constructor(public navCtrl: NavController, private candidatesProvider: CandidatesProvider) {

  }

  getCandidates(): void {
    this.candidatesProvider.getAll().subscribe(
         /* happy path */ c => this.candidates = c,
         /* error path */ e => this.errorMessage = e);
  }

  getUrl(candidate: Candidate): string {
    return `https://maps.googleapis.com/maps/api/streetview?size=640x480&location=${candidate.lat},${candidate.lng}&heading=${candidate.heading}&pitch=${candidate.pitch}&fov=120&key=${constants.googleKey}`;
  }

  ngOnInit(): void {
    this.getCandidates();
  }
}
