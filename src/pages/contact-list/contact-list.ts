import { Component } from '@angular/core';
import {IonicPage, MenuController, NavController, NavParams} from 'ionic-angular';

import { EditContactPage } from '../edit-contact/edit-contact';
import { ContactDetailPage } from '../contact-detail/contact-detail';
import {ContactServicesProvider} from "../../providers/contact-services/contact-services";
import {UserServicesProvider} from "../../providers/user-services/user-services";
import { CallNumber } from '@ionic-native/call-number';
import {User} from "../../model/User";
import {Storage} from "@ionic/storage";
import {Contact} from "../../model/Contact";


@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {

  searchQuery: string = '';
  //For tests
  contacts: Array<Contact>;
  verif0Contact: boolean = false;
  allContacts:Array<Contact>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController,
              public contactServices: ContactServicesProvider, private storage: Storage
              ,public userServices: UserServicesProvider,public callNumber: CallNumber) {

    this.menuCtrl.enable(true);
  }

  ionViewDidLoad() {
    this.initializeList();

  }
  ionViewWillEnter(){
    //important to place it here if we want the content to be reloaded each time we call at the contact-list
    this.storage.get('user').then((user:User)=>{
      this.contactServices.getContacts(user.token).then( (contacts: Array<Contact>) =>{
      this.allContacts = contacts;
      this.contacts = this.allContacts;
      this.verif0Contact = (this.contacts.length == 0);
      console.log(contacts)
    });
    })

  }

  initializeList() {
    // On récupère l'user en base locale et on lui assigne ses contacts, ensuite on le stocke en base locale avec ses contacts
    this.storage.get('user').then((user: User) => {
      console.log(user.phone);
      this.contactServices.getContacts(user.token).then((contacts:Array<Contact>) => {
        user.contacts = contacts;
        this.storage.set('user', user);
        this.allContacts = contacts;
        this.contacts = this.allContacts;
        this.verif0Contact = (this.contacts.length == 0);
        console.log(this.contacts)
      })
        .catch(error => console.log("erreur get contacts" + error))
    })
      .catch(error => console.log("erreur get user local" + error))
  }

  // on créé une liste de contact filtrée suivant la recherche effectuée
  searchFunction(event: any) {
    this.contacts=this.allContacts;
    let val = event.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.contacts = this.contacts.filter((item) => {
        if (item.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.lastName.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.phone.indexOf(val) > -1) {
          return item;
        }
      })
    }
  }
  callContact(phone){
    this.callNumber.callNumber(phone, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));

  }
  goToAddContact(){
    this.navCtrl.push(EditContactPage).then();
  }

  goToContactDetails(contact){
    this.navCtrl.push(ContactDetailPage, { 'contact': contact}).then();
  }
}
