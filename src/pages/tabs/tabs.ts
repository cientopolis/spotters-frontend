import { Component, NgZone } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { PanoramaPage } from '../panorama/panorama';
import { CandidatesPage } from '../candidates/candidates';
import { ProfilePage } from '../profile/profile';
import { ConfigurationProvider } from '../../providers/configuration.provider';
import { CandidatesProvider } from '../../providers/candidates.provider';
import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Candidate } from '../../models/candidate';
import { Location } from '../../models/location';
import _ from 'lodash';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePage;
  tab2Root: any = MapPage;
  tab3Root: any = PanoramaPage;
  tab4Root: any = CandidatesPage;
  tab5Root: any = ProfilePage;

  errorMessage: string;
  candidates: Candidate[] = []

  constructor(private _zone: NgZone, private configurationProvider: ConfigurationProvider, private candidatesProvider: CandidatesProvider, private currentLocationService: CurrentLocationService) {
    this.currentLocationService.candidates$.subscribe(
      c => this._zone.run(() => this.candidates = c),
      e => this.errorMessage = e);

    this.currentLocationService.location$.subscribe(
      l => {
        if (l) {
          this.getCandidates(l);
        }
      },
      e => this.errorMessage = e);

    this.configurationProvider.getAll().subscribe(
      c => {
        let configuration = _.first(c);
        currentLocationService.setConfiguration(configuration);
        Geolocation.getCurrentPosition().then((resp) => {
          let location = <Location>({
            lat: resp.coords.latitude,
            lng: resp.coords.longitude,
            heading: resp.coords.heading !== null ? resp.coords.heading : 0,
            pitch: 0
          });
          this.getCandidates(location);
          currentLocationService.setLocation(location);
        }).catch((error) => {
          let location = <Location>({
            lat: configuration.lat,
            lng: configuration.lng,
            heading: configuration.headingCenter,
            pitch: configuration.pitchCenter
          });
          this.getCandidates(location);
          currentLocationService.setLocation(location);
        });
      },
      e => this.errorMessage = e);
  }

  getCandidates(location: Location): void {
    this.candidatesProvider.getAll({ lat: location.lat, lng: location.lng }).subscribe(
      c => this.currentLocationService.setCandidates(c),
      e => this.errorMessage = e);
  }
}
