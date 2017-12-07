import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';

import { EditContactPage } from '../edit-contact/edit-contact';
import { ContactDetailPage } from '../contact-detail/contact-detail';
import {ContactServicesProvider} from "../../providers/contact-services/contact-services";



@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public contactServices: ContactServicesProvider) {
    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
    // METTRE LE VRAI TOKEN
    // this.contactServices.getContacts("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjY2NjY2NjY2NjYiLCJpYXQiOjE1MTI2NTIzOTIsImV4cCI6MTUxMjY1MjY5Mn0.ZG-mi3_vdDvnHeYyE9HUMg8al8UTBO0demeaHVUC_QM")
    //   .then( data => {
    //     console.log(data)
    //   })
  }
  goToEditView(){
    this.navCtrl.push(EditContactPage);
  }
  goToDetailView(){
    this.navCtrl.push(ContactDetailPage);
  }
}
