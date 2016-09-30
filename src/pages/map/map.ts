import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ConfigurationProvider } from '../../providers/configuration.provider';
import { Candidate } from '../../providers/candidate';
import { CandidatesProvider } from '../../providers/candidates.provider';

import * as _ from "lodash";

declare var google: any;

@Component({
    selector: 'mapa',
    styles: [`
        #gmap {
            height: 500px;
        }
    `],
    templateUrl: 'mapa.html',
    providers: [ConfigurationProvider, CandidatesProvider]
})

export class MapComponent implements OnInit {
    map: any;
    lat: number;
    long: number;
    candidates: Candidate[];

    constructor(private configurationProvider: ConfigurationProvider, private candidateProvider: CandidatesProvider) {

    }

    refreshMarkers(): void {
        _.each(this.candidates, candidate => {
            new google.maps.Marker({
                position: new google.maps.LatLng(candidate.lat, candidate.lng),
                map: this.map,
            })
        })
    }

    ngOnInit(): void {
        this.configurationProvider.getConfiguration().then(
            configuration => {
                this.lat = configuration.center.coordinates[1];
                this.long = configuration.center.coordinates[0];

                let mapProp = {
                    center: new google.maps.LatLng(this.lat, this.long),
                    zoom: configuration.defaultZoom,
                    scrollwheel: false,
                };

                this.map = new google.maps.Map(document.getElementById("gmap"), mapProp);

                //Obtengo los candidates por longitud y latitud inicial
                this.candidateProvider.getAll().then(candidates => this.candidates = candidates);

                this.refreshMarkers();

            }
        )
    }
}