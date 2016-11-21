import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CurrentLocationService } from '../../utils/currentLocation.service';
import { Configuration } from '../../models/configuration';
import _ from 'lodash';

@Component({
    selector: 'page-map',
    templateUrl: 'map.html'
})
export class MapPage {
    configuration: Configuration = null;

    constructor(public navCtrl: NavController, private currentLocation: CurrentLocationService) {
        currentLocation.configuration$.subscribe(
            c => {
                if (!_.isNil(c)) {
                    this.configuration = c;
                }
            });
    }
}