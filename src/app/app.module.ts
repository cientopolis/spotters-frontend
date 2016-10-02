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
import { CandidatesProvider } from '../providers/candidates.provider';
import { WorkflowsProvider } from '../providers/workflows.provider';
import { CurrentLocationService } from '../utils/currentLocation.service';
import { TextDirective } from '../directives/text.directive';

@NgModule({
  declarations: [
    SpottersApp,
    MapPage,
    PanoramaPage,
    CandidatesPage,
    ProfilePage,
    HomePage,
    TabsPage,
    TextDirective
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
    CandidatesProvider,
    WorkflowsProvider,
    CurrentLocationService
  ]
})
export class AppModule { }
