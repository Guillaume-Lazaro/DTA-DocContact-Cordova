import { Component } from '@angular/core';
import {Events,IonicPage, MenuController, NavController, NavParams, Platform, ToastController} from 'ionic-angular';
import { EditContactPage } from '../edit-contact/edit-contact';
import { ContactDetailPage } from '../contact-detail/contact-detail';
import {ContactServicesProvider} from "../../providers/contact-services/contact-services";
import { CallNumber } from '@ionic-native/call-number';
import {User} from "../../model/User";
import {Storage} from "@ionic/storage";
import {Contact} from "../../model/Contact";
import { TranslateService } from '@ngx-translate/core';
import {LoginPage} from "../login/login";

@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {

  searchQuery: string = '';
  contacts: Array<Contact>;
  verif0Contact: boolean = false;
  allContacts:Array<Contact>;
  searchBarPlaceholder:string = 'Bla';

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public platform: Platform,
              public contactServices: ContactServicesProvider, private storage: Storage, private translateService:TranslateService,
              public callNumber: CallNumber, public toastCtrl: ToastController,
              public events:Events) {

    this.menuCtrl.enable(true);

    let lastTimeBackPress = 0;
    let timePeriodToExit  = 2000;

    //Ajout d'un comportement spécial quand on clique :
    //Si l'on clique une seconde fois, l'appli se quitte
    platform.registerBackButtonAction(() => {
      if (navCtrl.canGoBack()) {
        navCtrl.pop();
      } else {
        if(new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
          //Double appui sur back: on quitte l'appli
          this.platform.exitApp();

        } else {
          //Premier appui: on prévient l'utilisateur
          let toast = this.toastCtrl.create({
            message:  this.translateService.instant('pressAgainToExit'),
            duration: 2000,
            position: 'bottom'
          });

          toast.present();

          lastTimeBackPress = new Date().getTime();
        }
      }
    });
  }

  ionViewDidLoad() {
    this.events.subscribe('no login',()=>{
      this.navCtrl.setRoot(LoginPage)
    })
    this.initializeList();

    this.searchBarPlaceholder = this.translateService.instant('searchBar');
  }

  ionViewWillEnter(){
    //important to place it here if we want the content to be reloaded each time we call at the contact-list
    this.storage.get('user').then((user:User)=>{
      this.contactServices.getContacts(user.token).then( (contacts: Array<Contact>) =>{
        this.allContacts = contacts;
        //this.contacts = this.allContacts; //OLD
        //NEW : La liste est triée et groupée par ordre alphabétique:
        this.contacts = this.groupContacts(this.allContacts);
        this.verif0Contact = (this.contacts.length == 0);
        user.contacts = contacts;       //Update user
        this.storage.set('user',user);  //on the database
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
      })
        .catch(error => console.log(error))
    })
      .catch(error => console.log(error))
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

  groupContacts(contacts) {
    let groupedContacts = [];

    contacts.forEach((value,index) => { //TODO remplacer ça par une refactorisation des formulaires
      value.lastName = value.lastName[0].toUpperCase() + value.lastName.substring(1)
    });

    let sortedContacts = contacts.sort(this.compare);
    let currentLetter = false;
    let currentContacts = [];

    sortedContacts.forEach((value, index) => {
      let valueName = value.lastName;
      if(valueName.charAt(0) != currentLetter) {
        currentLetter = valueName.charAt(0);

        let newGroup = {
          letter: currentLetter,
          contacts: []
        };

        currentContacts = newGroup.contacts;
        groupedContacts.push(newGroup);
      }

      currentContacts.push(value);
    });

    return groupedContacts;
  }

  compare(a,b) {
    if (a.lastName < b.lastName)
      return -1;
    if (a.lastName > b.lastName)
      return 1;
    return 0;
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
