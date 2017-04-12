import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import moment from 'moment';
import 'moment/src/locale/es';
import { Http, HttpModule } from '@angular/http';
import { Storage, IonicStorageModule } from '@ionic/storage';
import { MomentModule } from 'angular2-moment';
import { IonicApp, IonicModule, IonicErrorHandler, DeepLinkConfig } from 'ionic-angular';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { SpottersApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { PanoramaPage } from '../pages/panorama/panorama';
import { CandidatesPage } from '../pages/candidates/candidates';
import { CandidatePage } from '../pages/candidate/candidate';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ExpertPage } from '../pages/expert/expert';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { NewsProvider } from '../providers/news.provider';
import { UserProvider } from '../providers/user.provider';
import { ConfigurationProvider } from '../providers/configuration.provider';
import { CandidatesProvider } from '../providers/candidates.provider';
import { ClassificationsProvider } from '../providers/classifications.provider';
import { ClassificationVotesProvider } from '../providers/classificationVotes.provider';
import { MessagesProvider } from '../providers/messages.provider';
import { MessageVotesProvider } from '../providers/messageVotes.provider';
import { TutorialStepsProvider } from '../providers/tutorialSteps.provider';
import { WorkflowsProvider } from '../providers/workflows.provider';
import { CurrentLocationService } from '../utils/currentLocation.service';
import { TextDirective } from '../directives/text.directive';
import { MapaComponent } from '../utils/mapa.component';
import { CandidateCardComponent } from '../components/candidateCard/candidateCard.component';
import { ClassificationListComponent } from '../components/candidateCard/classificationList.component';
import { ClassificationItemComponent } from '../components/candidateCard/classificationItem.component';
import { MessageListComponent } from '../components/candidateCard/messageList.component';
import { MessageItemComponent } from '../components/candidateCard/messageItem.component';
import { AuthService } from '../services/auth/auth.service';
import { WorkFlowInput } from '../utils/input.component';
import { WorkFlowChoice } from '../utils/choice.component';
import { WorkFlowRadio } from '../utils/radio.component';
import { ModalContentPage } from '../components/workflow/modal';

import { Geolocation } from '@ionic-native/geolocation';
import { SocialSharing } from '@ionic-native/social-sharing';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

moment.locale('es');

export function getAuthHttp(http, storage) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{ 'Accept': 'application/json' }],
    tokenGetter: (() => storage.get('id_token'))
  }), http);
}

export const deepLinkConfig: DeepLinkConfig = {
    links: [
        { component: HomePage, name: 'home' },
        { component: MapPage, name: 'map', segment: 'map' },
        { component: PanoramaPage, name: 'panorama', segment: 'panorama' },
        { component: CandidatesPage, name: 'candidates', segment: 'candidates' },
        { component: CandidatePage, name: 'candidate', segment: 'candidates/:id', defaultHistory: ['CandidatesPage'] },
        { component: ProfilePage, name: 'profile', segment: 'profile' },
        { component: TutorialPage, name: 'tutorial', segment: 'profile/tutorial', defaultHistory: ['ProfilePage'] },
        { component: ExpertPage, name: 'expert', segment: 'profile/expert', defaultHistory: ['ProfilePage'] }
      ]
};

@NgModule({
  declarations: [
    SpottersApp,
    MapPage,
    PanoramaPage,
    CandidatesPage,
    CandidatePage,
    ProfilePage,
    HomePage,
    TabsPage,
    ExpertPage,
    TutorialPage,
    TextDirective,
    MapaComponent,
    CandidateCardComponent,
    ClassificationListComponent,
    ClassificationItemComponent,
    MessageListComponent,
    MessageItemComponent,
    WorkFlowInput,
    WorkFlowChoice,
    WorkFlowRadio,
    ModalContentPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    MomentModule,
    IonicModule.forRoot(SpottersApp, {}, deepLinkConfig),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    SpottersApp,
    MapPage,
    PanoramaPage,
    CandidatesPage,
    CandidatePage,
    ProfilePage,
    HomePage,
    TabsPage,
    ExpertPage,
    TutorialPage,
    ModalContentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    SocialSharing,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NewsProvider,
    UserProvider,
    ConfigurationProvider,
    CandidatesProvider,
    ClassificationsProvider,
    ClassificationVotesProvider,
    MessagesProvider,
    MessageVotesProvider,
    TutorialStepsProvider,
    WorkflowsProvider,
    CurrentLocationService,
    AuthService,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http, Storage]
    }
  ]
})
export class AppModule { }
