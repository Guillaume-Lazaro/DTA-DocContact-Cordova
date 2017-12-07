import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { InscriptionPage } from '../inscription/inscription';
import { ContactListPage } from '../contact-list/contact-list';
import {ApiServicesProvider} from "../../providers/api-services/api-services";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiServices: ApiServicesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }

  goToInscription(){
    this.apiServices.getUser("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA2MDAwMDAwMDIiLCJpYXQiOjE1MTI2MzYzNTMsImV4cCI6MTUxMjYzNjY1M30.C03-9hKd_kI0F3Og6LVTHa-veAdhEBqjPeUk5UZCNFk")
      .then(data => {
        console.log(data);
        this.navCtrl.push(InscriptionPage).then();
      })

  }
  goToAccueil(){
    this.navCtrl.push(ContactListPage);
  }

}
