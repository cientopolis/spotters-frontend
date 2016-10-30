import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { SpottersApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { PanoramaPage } from '../pages/panorama/panorama';
import { CandidatesPage } from '../pages/candidates/candidates';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { NewsProvider } from '../providers/news.provider';
import { UserProvider } from '../providers/user.provider';
import { CandidatesProvider } from '../providers/candidates.provider';
import { WorkflowsProvider } from '../providers/workflows.provider';
import { CurrentLocationService } from '../utils/currentLocation.service';
import { TextDirective } from '../directives/text.directive';
import { PanoramaComponent } from '../utils/panorama.component';
import { MapaComponent } from '../utils/mapa.component';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { AuthService } from '../services/auth/auth.service';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';

let storage: Storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{'Accept': 'application/json'}],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}

@NgModule({
  declarations: [
    SpottersApp,
    MapPage,
    PanoramaPage,
    CandidatesPage,
    ProfilePage,
    HomePage,
    TabsPage,
    TextDirective,
    PanoramaComponent,
    MapaComponent
  ],
  imports: [
    IonicModule.forRoot(SpottersApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    SpottersApp,
    MapPage,
    PanoramaPage,
    CandidatesPage,
    ProfilePage,
    HomePage,
    TabsPage
  ],
  providers: [
    NewsProvider,
    UserProvider,
    CandidatesProvider,
    WorkflowsProvider,
    CurrentLocationService,
    AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    }
  ]
})
export class AppModule { }
