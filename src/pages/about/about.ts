import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import {ContactListPage} from "../contact-list/contact-list";


@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {

  constructor(public navCtrl: NavController) {

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutPage');
  }

  goToContactList() {
    this.navCtrl.setRoot(ContactListPage, {}, {animate:true});
  }

}
