import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { PanoramaPage } from '../pages/panorama/panorama';
import { CandidatesPage } from '../pages/candidates/candidates';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { NewsProvider } from '../providers/news.provider';
import { CandidatesProvider } from '../providers/candidates.provider';

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    PanoramaPage,
    CandidatesPage,
    ProfilePage,
    HomePage,
    TabsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    PanoramaPage,
    CandidatesPage,
    ProfilePage,
    HomePage,
    TabsPage
  ],
  providers: [
    NewsProvider,
    CandidatesProvider
  ]
})
export class AppModule {}
