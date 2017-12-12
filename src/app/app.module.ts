import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { InscriptionPage } from '../pages/inscription/inscription';
import { ContactListPage } from '../pages/contact-list/contact-list';
import { ContactDetailPage } from '../pages/contact-detail/contact-detail';
import { EditContactPage } from '../pages/edit-contact/edit-contact';
import { UserProfilePage } from "../pages/user-profile/user-profile";
import { EditUserPage } from "../pages/edit-user/edit-user";
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiServicesProvider } from '../providers/api-services/api-services';
import { ContactServicesProvider } from '../providers/contact-services/contact-services';
import { HttpClientModule, HttpClient } from "@angular/common/http";
import { UserServicesProvider } from '../providers/user-services/user-services';
import { CallNumber } from '@ionic-native/call-number';
import {IonicStorageModule} from "@ionic/storage";
import { EmailComposer } from '@ionic-native/email-composer';
import { SMS } from '@ionic-native/sms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
//   A LAISSER - DECOMMENTER DANS LA VERSION FINALE  import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    InscriptionPage,
    ContactListPage,
    ContactDetailPage,
    EditContactPage,
    EditUserPage,
    UserProfilePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    InscriptionPage,
    ContactListPage,
    ContactDetailPage,
    EditContactPage,
    EditUserPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    //   A LAISSER - DECOMMENTER DANS LA VERSION FINALE    ScreenOrientation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServicesProvider,
    ContactServicesProvider,
    UserServicesProvider,
    CallNumber,
    EmailComposer,
    SMS
  ],
})
export class AppModule {}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/','.json');
}
