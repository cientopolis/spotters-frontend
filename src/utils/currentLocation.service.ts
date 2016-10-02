import _ from 'lodash';
import { Injectable } from '@angular/core';

import 'rxjs/Rx';

@Injectable()
export class CurrentLocationService {
    lat: number = null;
    lng: number = null;
    heading: number = null;
    pitch: number = null;
    refresh: boolean = false;

    isBlank() {
        return _.isNull(this.lat) && _.isNull(this.lng) && _.isNull(this.heading) && _.isNull(this.pitch);
    }
}
