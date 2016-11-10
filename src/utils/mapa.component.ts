import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ConfigurationProvider } from '../providers/configuration.provider';
import { CandidatesProvider } from '../providers/candidates.provider';
import { Candidate } from '../models/candidate';
import { Configuration } from '../models/configuration';
import { CurrentLocationService } from './currentLocation.service';
import { GoogleMapsLoader } from './mapLoader';
import _ from "lodash";

declare var google: any;

@Component({
    selector: 'googleMap',
    template: `
        <div id="gmap"></div>
        <streetview [fix]="1"></streetview>
    `,
    providers: [ConfigurationProvider, CandidatesProvider, GoogleMapsLoader]
})
export class MapaComponent implements OnInit {
    map: any;
    panorama: any;
    candidates: Candidate[];
    configuration: Configuration;
    errorMessage: string;
    markers: any[] = [];
    mapLoader: GoogleMapsLoader;

    constructor(mapLoader: GoogleMapsLoader, private configurationProvider: ConfigurationProvider, private candidatesProvider: CandidatesProvider, public currentLocationService: CurrentLocationService) {
        this.mapLoader = mapLoader;
        currentLocationService.refresh$.subscribe(
            refresh => {
                if (refresh) {
                    currentLocationService.setRefresh(false);
                    this.movePanorama();
                    this.refreshPanorama();
                }
            });
    }

    updateCurrentPosition() {
        if (this.panorama && !this.currentLocationService.getRefresh() && !this.currentLocationService.isEqualTo(this.panorama.getPosition().lat(), this.panorama.getPosition().lng(), this.panorama.getPov().heading, this.panorama.getPov().pitch)) {
            this.currentLocationService.setLat(this.panorama.getPosition().lat());
            this.currentLocationService.setLng(this.panorama.getPosition().lng());
            this.currentLocationService.setHeading(this.panorama.getPov().heading);
            this.currentLocationService.setPitch(this.panorama.getPov().pitch);
            this.currentLocationService.setRefresh(true);
            this.getCandidates();
        }
    }

    public movePanorama(): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                if (this.panorama && !(this.currentLocationService.getLat() === this.panorama.getPosition().lat() && this.currentLocationService.getLng() === this.panorama.getPosition().lng())) {
                    this.panorama.setPosition(new _mapsApi.LatLng(this.currentLocationService.getLat(), this.currentLocationService.getLng()));
                    this.getCandidates();
                }
            });
    }

    public refreshPanorama(): void {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                if (this.panorama && !(this.currentLocationService.getHeading() === this.panorama.getPov().heading && this.currentLocationService.getPitch() === this.panorama.getPov().pitch)) {
                    this.panorama.setPov({
                        heading: this.currentLocationService.getHeading(),
                        pitch: this.currentLocationService.getPitch()
                    });
                }
            });
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        })
        this.markers = [];
    }

    refreshMarkers(): void {
        this.clearMarkers()
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                _.each(this.candidates, candidate => {
                    this.markers.push(new _mapsApi.Marker({
                        position: new _mapsApi.LatLng(candidate.lat, candidate.lng),
                        map: this.map,
                    }));
                });
            });
    }

    getConfiguration() {
        this.configurationProvider.getAll().subscribe(
            c => {
                this.configuration = _.first(c);
                if (this.currentLocationService.isBlank()) {
                    this.currentLocationService.setLat(this.configuration.lat);
                    this.currentLocationService.setLng(this.configuration.lng);
                    this.currentLocationService.setHeading(this.configuration.headingCenter);
                    this.currentLocationService.setPitch(this.configuration.pitchCenter);
                    this.currentLocationService.setRefresh(true);
                }
                this.setMap();
            },
            e => this.errorMessage = e);
    }

    getCandidates(): void {
        this.candidatesProvider.getAll({ lat: this.currentLocationService.getLat(), lng: this.currentLocationService.getLng() }).subscribe(
            c => {
                this.candidates = c
                this.refreshMarkers();
            },
            e => this.errorMessage = e);
    }

    setMap() {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                let mapProp = {
                    center: new _mapsApi.LatLng(this.currentLocationService.getLat(), this.currentLocationService.getLng()),
                    zoom: this.configuration.zoom,
                    scrollwheel: false,
                };

                this.map = new _mapsApi.Map(document.getElementById("gmap"), mapProp);
                let panoramaProp = {
                    position: new _mapsApi.LatLng(this.currentLocationService.getLat(), this.currentLocationService.getLng()),
                    pov: {
                        heading: this.currentLocationService.getHeading(),
                        pitch: this.currentLocationService.getPitch()
                    }
                }
                this.panorama = new _mapsApi.StreetViewPanorama(document.getElementById('streetview_1'), panoramaProp);
                this.map.setStreetView(this.panorama);
                this.panorama.addListener('position_changed', () => {
                    this.updateCurrentPosition();
                });
                this.panorama.addListener('pov_changed', () => {
                    this.updateCurrentPosition();
                });

                this.getCandidates();
            });
    }

    ngOnInit(): void {
        this.getConfiguration();
    }
}
