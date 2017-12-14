import { Component, ViewChild } from '@angular/core';
import { App, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../pages/login/login';
import { ContactListPage } from "../pages/contact-list/contact-list";
import { UserServicesProvider } from "../providers/user-services/user-services";
import { EditUserPage } from "../pages/edit-user/edit-user";
import { Storage } from "@ionic/storage";
import { User } from "../model/User";
import { ApiServicesProvider } from "../providers/api-services/api-services";
// A LAISSER - DECOMMENTER DANS LA VERSION FINALE     import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ImportServicesProvider } from "../providers/import-services/import-services";
import { AboutPage } from "../pages/about/about";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  menuUser: any;

  deconnexion: any =  {title: 'Deconnexion', component: LoginPage};
  myProfile: any =    {title: 'Modifier mon Profil', component: EditUserPage };
  myContacts : any =  {title: 'Mes Contacts', component: ContactListPage };
  about: any = {title: 'A propos', component: AboutPage };

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public app:App, private userService: UserServicesProvider,
              private storage: Storage, private translateService: TranslateService, public apiServices: ApiServicesProvider,
              private importServices : ImportServicesProvider) {
    //A LAISSER - DECOMMENTER DANS LA VERSION FINALE: private screenOrientation: ScreenOrientation

    this.initializeApp();
    //A LAISSER - DECOMMENTER DANS LA VERSION FINALE: this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    //Initilization du service de traduction:
    this.platform.ready().then(()=> {
      let lang:string = navigator.language; //Langue systéme utilisé par le device

      lang = lang.substring(0,2);

      if (lang != "en" && lang != "fr") {
        lang = "fr";  //Langue par défaut
      }

      this.translateService.setDefaultLang(lang);

    });

    app.viewWillEnter.subscribe(
      () => {
        this.checkIfUserInfoCanBeDisplayed()
      })
  }

  checkIfUserInfoCanBeDisplayed(){
    //If a token has been set, we're going to see if we have a user, else we're fetching it
      this.storage.get('user').then((user:User)=>{
        this.menuUser = user;
      })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.apiServices.getProfiles().toPromise().then(profiles=>{
        this.storage.set('profiles',profiles).then().catch(error=>console.log(error))
      }).catch(error=>console.log(error))
    });
  }

  openPage(page) {
    // TODO : Gérer la déconnexion
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title == 'Deconnexion'){
      this.storage.set('user',undefined).then(()=>{
        this.nav.setRoot(page.component)
    })
    }else{
      this.nav.setRoot(page.component);
    }
  }
  importContacts() {
      this.importServices.importContacts().then(()=>{
        this.nav.setRoot(ContactListPage);
      });
  }
}
