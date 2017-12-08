import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EditContactPage} from "../edit-contact/edit-contact";

/**
 * Generated class for the ContactDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html',
})
export class ContactDetailPage {

  contact: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.contact = this.navParams.get('contact');
    console.log(this.contact);
  }

  goToEditView(contact){
    this.navCtrl.push(EditContactPage, { 'contact': this.contact }).then();
  }

}
