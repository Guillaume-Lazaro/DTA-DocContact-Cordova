import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { InscriptionPage } from '../pages/inscription/inscription';
import { ContactListPage } from '../pages/contact-list/contact-list';
import { ContactDetailPage } from '../pages/contact-detail/contact-detail';
import { EditContactPage } from '../pages/edit-contact/edit-contact';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ApiServicesProvider } from '../providers/api-services/api-services';
import { ContactServicesProvider } from '../providers/contact-services/contact-services';
import { HttpClientModule } from "@angular/common/http";
import { UserServicesProvider } from '../providers/user-services/user-services';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    InscriptionPage,
    ContactListPage,
    ContactDetailPage,
    EditContactPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    InscriptionPage,
    ContactListPage,
    ContactDetailPage,
    EditContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiServicesProvider,
    ContactServicesProvider,
    UserServicesProvider
  ],
})
export class AppModule {}
