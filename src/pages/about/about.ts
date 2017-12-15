import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {ContactListPage} from "../contact-list/contact-list";
import {BrowserTab} from "@ionic-native/browser-tab";


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  public lottieConfig: Object;
  private anim: any;

  constructor(public navCtrl: NavController, private browserTab: BrowserTab) {
    this.lottieConfig = {
      path: 'assets/animation/victory.json',
      autoplay: true,
      loop: true
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }


  handleAnimation(anim: any) {
    this.anim = anim;
    this.anim.setSpeed(1)
  }

  goToContactList() {
    this.navCtrl.setRoot(ContactListPage, {}, {animate:true});
  }

  goToGitHub(){
    this.browserTab.isAvailable()
      .then((isAvailable: boolean) => {

        if (isAvailable) {

          this.browserTab.openUrl('https://github.com/deltahammerfest/DTA-DocContact-Cordova');

        } else {



        }

      });

  }

}
