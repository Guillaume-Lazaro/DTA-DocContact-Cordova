import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { InscriptionPage } from '../inscription/inscription';
import { ContactListPage } from '../contact-list/contact-list';


import { Contact } from '../../model/Contact';
import { ApiServicesProvider } from "../../providers/api-services/api-services";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public apiServices : ApiServicesProvider) {
    apiServices.logUser('0655545546', '0000').subscribe((e)=>console.log(e));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToInscription(){
    this.navCtrl.push(InscriptionPage);
  }
  goToAccueil(){
    this.navCtrl.push(ContactListPage);
  }

}
