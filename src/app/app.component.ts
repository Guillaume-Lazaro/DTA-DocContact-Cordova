import { Component, ViewChild } from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// A LAISSER - DECOMMENTER DANS LA VERSION FINALE     import { ScreenOrientation } from '@ionic-native/screen-orientation';

import { LoginPage } from '../pages/login/login';
import {ContactListPage} from "../pages/contact-list/contact-list";
import {UserProfilePage} from "../pages/user-profile/user-profile";
import {UserServicesProvider} from "../providers/user-services/user-services";
import {EditUserPage} from "../pages/edit-user/edit-user";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public userServices: UserServicesProvider ) {
         //   A LAISSER - DECOMMENTER DANS LA VERSION FINALE   private screenOrientation: ScreenOrientation
    this.initializeApp();
    //   A LAISSER - DECOMMENTER DANS LA VERSION FINALE      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Modifier mon Profil', component: EditUserPage },
      { title: 'Mes Contacts', component: ContactListPage },
      { title: 'Deconnexion', component: LoginPage}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title == 'Deconnexion'){
      this.userServices.token = '';
    }
    console.log('le token est :'+this.userServices.token);
    this.nav.setRoot(page.component);
  }
}
