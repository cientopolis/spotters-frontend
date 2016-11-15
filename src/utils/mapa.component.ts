import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { Candidate } from '../models/candidate';
import { Configuration } from '../models/configuration';
import { Location } from '../models/location';
import { CurrentLocationService } from './currentLocation.service';
import { GoogleMapsLoader } from './mapLoader';
import _ from "lodash";
import randomstring from 'randomstring';

declare var google: any;

@Component({
    selector: 'googleMap',
    template: `
        <div [hidden]="panoramaOnly" id="gmap"></div>
        <div class="street" id="streetview_{{fix}}"></div>
    `,
    providers: [GoogleMapsLoader]
})
export class MapaComponent implements OnInit, OnChanges {
    @Input() panoramaOnly: boolean = false;
    @Input() fix: string = randomstring.generate();
    @Input() hidden: boolean = false;
    @Input() candidate: Candidate = null;
    map: any = null;
    panorama: any = null;
    location: Location = null;
    configuration: Configuration;
    errorMessage: string;
    markers: any[] = [];

    constructor(public mapLoader: GoogleMapsLoader, public currentLocationService: CurrentLocationService) { }

    updateCurrentPosition() {
        if (this.panorama) {
            let l = <Location>({
                lat: this.panorama.getPosition().lat(),
                lng: this.panorama.getPosition().lng(),
                heading: this.panorama.getPov().heading,
                pitch: this.panorama.getPov().pitch
            });
            if (this.location.lat !== l.lat || this.location.lng !== l.lng) {
                this.currentLocationService.setLocation(l);
            }
        }
    }

    refreshPanorama(location: Location): void {
        if (this.location.lat !== location.lat || this.location.lng !== location.lng) {
            this.location = location;
            this.panorama.setPosition({ lat: this.location.lat, lng: this.location.lng });
            this.panorama.setPov({
                heading: this.location.heading,
                pitch: this.location.pitch
            });
        }
    }

    clearMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        })
        this.markers = [];
    }

    refreshMarkers(candidates: Candidate[]): void {
        this.clearMarkers()
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                _.each(candidates, candidate => {
                    this.markers.push(new _mapsApi.Marker({
                        position: new _mapsApi.LatLng(candidate.lat, candidate.lng),
                        map: this.map,
                    }));
                });
            });
    }

    setMap(latlng, pov) {
        GoogleMapsLoader.load()
            .then((_mapsApi) => {
                let panoramaProp = {
                    position: latlng,
                    pov: pov
                }
                this.panorama = new _mapsApi.StreetViewPanorama(document.getElementById(`streetview_${this.fix}`), panoramaProp);
                _mapsApi.event.addListener(this.panorama, 'position_changed', () => {
                    this.updateCurrentPosition();
                });

                if (!this.panoramaOnly) {
                    let mapProp = {
                        center: latlng,
                        zoom: this.configuration.zoom,
                        scrollwheel: false,
                    };
                    this.map = new _mapsApi.Map(document.getElementById("gmap"), mapProp);
                    this.map.setStreetView(this.panorama);
                }
            });
    }

    ngOnInit() {
        if (_.isNil(this.candidate)) { // Full map/panorama
            this.currentLocationService.configuration$.subscribe(
                configuration => this.configuration = configuration);
            this.currentLocationService.candidates$.subscribe(
                candidates => this.refreshMarkers(candidates));
            this.currentLocationService.location$.subscribe(
                location => {
                    if (!_.isNil(location)) {
                        if (_.isNil(this.panorama)) {
                            this.location = location;
                            this.setMap({
                                lat: this.location.lat,
                                lng: this.location.lng
                            }, {
                                    heading: this.location.heading,
                                    pitch: this.location.pitch
                                });
                        } else {
                            this.refreshPanorama(location);
                        }
                    }
                });
        } else { // Panorama for a single candidate
            console.log(this.candidate);
            this.setMap({
                lat: this.candidate.lat,
                lng: this.candidate.lng
            }, {
                    heading: this.candidate.heading,
                    pitch: this.candidate.pitch
                });
        }
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        for (let propName in changes) {
            if (this.panorama && propName === 'hidden') {
                GoogleMapsLoader.load()
                    .then((_mapsApi) => {
                        _mapsApi.event.trigger(this.panorama, 'resize');
                    });
            }
        }
    }
}
