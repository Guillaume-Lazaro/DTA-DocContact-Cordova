import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ContactServicesProvider} from "../../providers/contact-services/contact-services";
import {UserServicesProvider} from "../../providers/user-services/user-services";

/**
 * Generated class for the EditContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-contact',
  templateUrl: 'edit-contact.html',
})
export class EditContactPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public contactServices: ContactServicesProvider, public userServices: UserServicesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditContactPage');
  }

}
