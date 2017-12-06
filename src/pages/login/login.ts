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
    this.apiServices.getUser("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA5NDYxMzI3NDgiLCJpYXQiOjE1MTI1Nzk2MzQsImV4cCI6MTUxMjU3OTkzNH0.1btb7R78Nt7o3jAB1oDvHyrj4Y_GRjdLH1gRmV3JOko")
      .then(data => {
        console.log(data);
        this.navCtrl.push(InscriptionPage).then();
      })

  }
  goToAccueil(){
    this.navCtrl.push(ContactListPage);
  }

}
