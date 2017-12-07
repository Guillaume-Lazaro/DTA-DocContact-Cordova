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

  searchQuery: string = '';
  //For tests
  contacts:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public contactServices: ContactServicesProvider) {
    this.menuCtrl.enable(true);

  }

  ionViewDidLoad() {
    this.initializeList();
    // METTRE LE VRAI TOKEN
    // this.contactServices.getContacts("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjY2NjY2NjY2NjYiLCJpYXQiOjE1MTI2NTIzOTIsImV4cCI6MTUxMjY1MjY5Mn0.ZG-mi3_vdDvnHeYyE9HUMg8al8UTBO0demeaHVUC_QM")
    //   .then( data => {
    //     console.log(data)
    //   })
  }

  initializeList(){
    //For tests
    this.contacts = this.navParams.get('contacts');
  }

  searchFunction(event: any){
    this.initializeList();
    let val = event.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.contacts = this.contacts.filter((item) => {
        if(item.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.lastName.toLowerCase().indexOf(val.toLowerCase()) > -1){
          return item;
        }
      })
    }
  }
  goToEditView(){
    this.navCtrl.push(EditContactPage);
  }
  goToContactDetails(contact){
    this.navCtrl.push(ContactDetailPage, { 'contact': contact});
  }
}
