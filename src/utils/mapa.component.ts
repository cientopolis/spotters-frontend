import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ConfigurationProvider } from '../providers/configuration.provider';
import { CandidatesProvider } from '../providers/candidates.provider';
import { Candidate } from '../providers/candidate';
import { Configuration } from '../providers/configuration';
import { CurrentLocationService } from './currentLocation.service';

import _ from "lodash";

declare var google: any;

@Component({
    selector: 'googleMap',
    template: `
        <div id="gmap"></div>
        <streetview [fix]="1"></streetview>
    `,
    providers: [ConfigurationProvider, CandidatesProvider]
})
export class MapaComponent implements OnInit {
    map: any;
    panorama: any;
    lat: number;
    long: number;
    candidates: Candidate[];
    configuration: Configuration;
    errorMessage: string;
    markers: any[] = [];

    constructor(private configurationProvider: ConfigurationProvider, private candidatesProvider: CandidatesProvider, public currentLocationService: CurrentLocationService) {
        currentLocationService.lat$.subscribe(
            lat => {
                console.log('llega un lat nuevo =)');
                console.log(lat);
                this.lat = lat;
            });
    }

    updateCurrentPosition() {
        //this.currentLocationService.lat = this.panorama.getPosition().lat();
        this.currentLocationService.setLat(this.panorama.getPosition().lat());

        this.currentLocationService.lng = this.panorama.getPosition().lng();
        this.currentLocationService.heading = this.panorama.getPov().heading;
        this.currentLocationService.pitch = this.panorama.getPov().pitch;
        this.currentLocationService.refresh = true;
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
                console.log('en el mapa, checkeo si es blank');
                if (this.currentLocationService.isBlank()) {
                    console.log('el mapa me dice que es blank');
                    this.currentLocationService.setLat(this.configuration.lat);
                    this.currentLocationService.lng = this.configuration.lng;
                    this.currentLocationService.heading = this.configuration.headingCenter;
                    this.currentLocationService.pitch = this.configuration.pitchCenter;
                    this.currentLocationService.refresh = true;
                }

                this.setMap();
            },
         /* error path */ e => this.errorMessage = e);
    }

    getCandidates(): void {
        this.candidatesProvider.getAll({ lat: this.lat, lng: this.currentLocationService.lng }).subscribe(
         /* happy path */ c => {
                this.candidates = c
                this.refreshMarkers();
            },
         /* error path */ e => this.errorMessage = e);
    }

    setMap() {
        let mapProp = {
            center: new google.maps.LatLng(this.lat, this.configuration.lng),
            zoom: this.configuration.zoom,
            scrollwheel: false,
        };

        this.map = new google.maps.Map(document.getElementById("gmap"), mapProp);

        console.log(this.lat);
        let panoramaProp = {
            position: new google.maps.LatLng(this.lat, this.currentLocationService.lng),
            pov: {
                heading: this.currentLocationService.heading,
                pitch: this.currentLocationService.pitch
            }
        }
        this.panorama = new google.maps.StreetViewPanorama(document.getElementById('streetview_1'), panoramaProp);

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
