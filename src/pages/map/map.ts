import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import _ from "lodash";

declare var google: any;

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage implements OnInit {
    map: any;
    panorama: any;
    lat: number;
    long: number;
    errorMessage: string;
    markers: any[] = [];

    constructor(public navCtrl: NavController) {

    }

    ngOnInit(): void {
        // this.getConfiguration();
    }
}