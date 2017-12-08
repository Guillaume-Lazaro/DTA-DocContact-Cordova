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
  verif0Contact: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public contactServices: ContactServicesProvider) {
    this.menuCtrl.enable(true);

  }

  ionViewDidLoad() {
    this.initializeList();
    this.verif0Contact = (this.contacts.length == 0);
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
        if(item.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.lastName.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.phone.indexOf(val) > -1 ){
          return item;
        }
      })
    }
  }
  goToAddContact(){
    this.navCtrl.push(EditContactPage).then();
  }

  goToContactDetails(contact){
    this.navCtrl.push(ContactDetailPage, { 'contact': contact}).then();
  }
}
