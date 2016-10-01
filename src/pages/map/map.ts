import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConfigurationProvider } from '../../providers/configuration.provider';
import { CandidatesProvider } from '../../providers/candidates.provider';
import { Candidate } from '../../providers/candidate';
import { Configuration } from '../../providers/configuration';
import { CurrentLocationService } from '../../utils/currentLocation.service';

import _ from "lodash";

declare var google: any;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html',
    providers: [ConfigurationProvider, CandidatesProvider, CurrentLocationService]
})
export class MapPage implements OnInit {
    map: any;
    panorama: any;
    lat: number;
    long: number;
    candidates: Candidate[];
    configuration: Configuration;
    errorMessage: string;
    markers: any[] = [];

    constructor(public navCtrl: NavController, private configurationProvider: ConfigurationProvider, private candidatesProvider: CandidatesProvider, private currentLocation: CurrentLocationService) {

    }

    updateCurrentPosition() {
        this.currentLocation.lat = this.panorama.getPosition().lat();
        this.currentLocation.lng = this.panorama.getPosition().lng();
        this.currentLocation.heading = this.panorama.getPov().heading;
        this.currentLocation.pitch = this.panorama.getPov().pitch;
        this.currentLocation.refresh = true;
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        })
        this.markers = [];
    }

    refreshMarkers(): void {
        this.clearMarkers()
        _.each(this.candidates, candidate => {
            this.markers.push(new google.maps.Marker({
                position: new google.maps.LatLng(candidate.lat, candidate.lng),
                map: this.map,
            }));
        });
    }

    getConfiguration() {
        this.configurationProvider.getAll().subscribe(
         /* happy path */ c => {
                this.configuration = _.first(c);

                if (this.currentLocation.isBlank()) {
                    this.currentLocation.lat = this.configuration.lat;
                    this.currentLocation.lng = this.configuration.lng;
                    this.currentLocation.heading = this.configuration.headingCenter;
                    this.currentLocation.pitch = this.configuration.pitchCenter;
                    this.currentLocation.refresh = true;
                }

                this.setMap();
            },
         /* error path */ e => this.errorMessage = e);
    }

    getCandidates(): void {
        this.candidatesProvider.getAll({ lat: this.currentLocation.lat, lng: this.currentLocation.lng }).subscribe(
         /* happy path */ c => {
                this.candidates = c
                this.refreshMarkers();
            },
         /* error path */ e => this.errorMessage = e);
    }

    setMap() {
        let mapProp = {
            center: new google.maps.LatLng(this.configuration.lat, this.configuration.lng),
            zoom: this.configuration.zoom,
            scrollwheel: false,
        };

        this.map = new google.maps.Map(document.getElementById("gmap"), mapProp);

        let panoramaProp = {
            position: new google.maps.LatLng(this.currentLocation.lat, this.currentLocation.lng),
            pov: {
                heading: this.currentLocation.heading,
                pitch: this.currentLocation.pitch
            }
        }

        console.log(panoramaProp);

        this.panorama = new google.maps.StreetViewPanorama(document.getElementById('streetview'), panoramaProp);

        this.map.setStreetView(this.panorama);

        this.panorama.addListener('position_changed', () => {
            this.updateCurrentPosition();
            this.getCandidates();
        });

        this.getCandidates();
    }

    ngOnInit(): void {
        this.getConfiguration();
    }
}