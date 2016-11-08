import { NgModule } from '@angular/core';
import moment from 'moment';
import 'moment/src/locale/es';
import { MomentModule } from 'angular2-moment';
import { IonicApp, IonicModule } from 'ionic-angular';
import { AuthConfig, AuthHttp } from 'angular2-jwt';
import { SpottersApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { PanoramaPage } from '../pages/panorama/panorama';
import { CandidatesPage } from '../pages/candidates/candidates';
import { ProfilePage } from '../pages/profile/profile';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { ExpertPage } from '../pages/expert/expert';
import { NewsProvider } from '../providers/news.provider';
import { UserProvider } from '../providers/user.provider';
import { ConfigurationProvider } from '../providers/configuration.provider';
import { CandidatesProvider } from '../providers/candidates.provider';
import { ClassificationVotesProvider } from '../providers/classificationVotes.provider';
import { MessagesProvider } from '../providers/messages.provider';
import { MessageVotesProvider } from '../providers/messageVotes.provider';
import { WorkflowsProvider } from '../providers/workflows.provider';
import { CurrentLocationService } from '../utils/currentLocation.service';
import { TextDirective } from '../directives/text.directive';
import { PanoramaComponent } from '../utils/panorama.component';
import { MapaComponent } from '../utils/mapa.component';
import { CandidateCardComponent } from '../components/candidateCard/candidateCard.component';
import { ClassificationListComponent } from '../components/candidateCard/classificationList.component';
import { ClassificationItemComponent } from '../components/candidateCard/classificationItem.component';
import { MessageListComponent } from '../components/candidateCard/messageList.component';
import { MessageItemComponent } from '../components/candidateCard/messageItem.component';
import { AuthService } from '../services/auth/auth.service';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import { WorkFlowInput } from '../utils/input.component';
import { WorkFlowChoice } from '../utils/choice.component';

moment.locale('es');

let storage: Storage = new Storage();

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    globalHeaders: [{ 'Accept': 'application/json' }],
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
    ExpertPage,
    TextDirective,
    PanoramaComponent,
    MapaComponent,
    CandidateCardComponent,
    ClassificationListComponent,
    ClassificationItemComponent,
    MessageListComponent,
    MessageItemComponent,
    WorkFlowInput,
    WorkFlowChoice
  ],
  imports: [
    MomentModule,
    IonicModule.forRoot(SpottersApp)
  ],
  bootstrap: [
    IonicApp
  ],
  entryComponents: [
    SpottersApp,
    MapPage,
    PanoramaPage,
    CandidatesPage,
    ProfilePage,
    HomePage,
    TabsPage,
    ExpertPage
  ],
  providers: [
    NewsProvider,
    UserProvider,
    ConfigurationProvider,
    CandidatesProvider,
    ClassificationVotesProvider,
    MessagesProvider,
    MessageVotesProvider,
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
