import { HttpClient } from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import { User } from "../../model/User";
import { Contact } from "../../model/Contact";
import { Contacts } from "@ionic-native/contacts";
import { ContactServicesProvider } from "../contact-services/contact-services";
import { ApiServicesProvider } from "../api-services/api-services";
import { Storage } from "@ionic/storage";
import {Nav, ToastController} from "ionic-angular";

@Injectable()
export class ImportServicesProvider {

  profiles :any;
  token : string;
  contactsAddedCount: number;
  wrongContacts : Array<any> = [];
  nbContactsAjoutes = 0;

  constructor(public http: HttpClient, private contacts: Contacts, private contactServices: ContactServicesProvider,
              private storage: Storage, private apiServices: ApiServicesProvider, private toastCtrl: ToastController) {

    this.getProfileTypes();
  }

  importContacts(){
    this.wrongContacts = [];
    this.nbContactsAjoutes = 0;
    this.contacts.find([name]).then((repertoireContacts : any) =>{                      // Get contacts from phone book
      let distantList;
      repertoireContacts= this.filterUnwantedContacts(repertoireContacts);                              // Clean the list of contacts

      this.storage.get('user').then((user: User) => {                                         // Get remote contacts
        this.token = user.token;
        this.contactServices.getContacts(user.token).then((contacts:Array<Contact>) => {

          // Loop over the contacts from the phone book in order to find the ones that share a phone number with the remote db
          let knownContactsArray = repertoireContacts.map((contact : any)=>{
            const result = contacts.filter((serverContact: any)=> {
              return contact.phoneNumbers[0].value === serverContact.phone;
            });
            return result;
          });
          console.log('knonwContactFilter');
          console.log(knownContactsArray);                                                              // knownContactFilter is an array of arrays that contains the contacts that share a phone number with the remote contacts


          let contactToAdd : Array<any> = [];                                                           // We need to clean up the knownContactsFilter. This array will host clean data and remplace the knownContactFilter
          knownContactsArray.forEach((array)=> {
            let previousItem:any = 0;
            for(let i = 0; i<array.length;i++){
              if(previousItem != 0 && array[i].firstName === previousItem.firstName &&  array[i].lastName === previousItem.lastName &&  array[i].phone === previousItem.phone){
              }else{
                contactToAdd.push(array[i]);
              }
              previousItem = array[i];
            }
          });                                                                                            // Clean array with the contacts ALREADY in the remote db
          let newContacts = repertoireContacts ;                                                         // Copy of the contacts from the phone book

          contactToAdd.forEach((knownContact)=>{
            let phone = knownContact.phone;
            newContacts.map((contact)=>{
              if(contact.phoneNumbers[0].value === phone){
                newContacts.splice(newContacts.indexOf(contact),1);
              }

            })
          });

          console.log('contacts à ajouter :');
          console.log(newContacts);

          this.contactsAddedCount = newContacts.length;
          console.log('ajout de '+this.contactsAddedCount+ " en cours");
          if(this.contactsAddedCount>0){                                                                  // If some contacts need to be added
            this.createTheNewUsers(newContacts).then(()=>{
              console.log(this.wrongContacts);
              console.log(this.wrongContacts.length);

              if(this.wrongContacts.length>0){
                let names = '';
                this.wrongContacts.forEach((contact)=>{
                  names += contact.displayName + ', ';
                });
                let message = "Les contacts "+names+" ne peuvent pas être ajoutés car ils ne sont pas valides. Il y a donc"+this.nbContactsAjoutes+" contacts qui ont étés ajoutés";
                this.sendToast(message);
              }
              console.log('traitement fini');
            });
          }else{
            let message = 'Tous les contacts de votre répertoire ont déjà été ajoutés';
            this.sendToast(message);
          }




          // A faire quand la liste est bien
          //user.contacts = contacts;
          //this.storage.set('user', user);
        })
          .catch(error => console.log("erreur get contacts" + error))
      })
        .catch(error => console.log("erreur get user local" + error))

    })

// Ajouter à la base distante les nouveaux contacts

//get base distante

//remplacer les users

//rafraichir la vue

  }

  saveContact(contact){
    if(contact.name != undefined && contact.phoneNumbers.length != 0 ){



    }
  }

// Here we check if the contact has at least a firstName, lastName and a phone number
  filterUnwantedContacts(contactArray){
    let filteredArray = contactArray.filter((contact)=> {
      return contact.name.familyName!=null && contact.name.givenName!=null && contact.phoneNumbers != null && contact.phoneNumbers[0].value != null
    });
    filteredArray = filteredArray.map((contact)=> {
      contact.phoneNumbers[0].value = contact.phoneNumbers[0].value.replace(/ /g, '');
      return contact;
    });
    return filteredArray;
  }

  getProfileTypes(){
    if(this.profiles==null || this.profiles == undefined){
      this.apiServices.getProfiles().toPromise().then((profiles)=>{
        this.profiles = profiles;
        console.log('dans la fonction ');
        console.log(profiles);
      });
    }
  }

  sendToast(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  createTheNewUsers(newContacts : Array<any>){
    return new Promise((resolve)=>{
      let i = 0;
      let indicateur = newContacts.length;
      newContacts.map((contact)=>{
        let email = "example@example.fr";
        let phone =  contact.phoneNumbers[0].value;
        let profile = this.profiles[0];
        let isEmergencyUser = false;


        let verif = this.verifIfValidContact(contact);

        if(verif){
          console.log("On va ajouter : "+ contact.name.givenName, contact.name.familyName, phone, email, profile, isEmergencyUser, this.token);
          this.contactServices.createContact(contact.name.givenName, contact.name.familyName, phone, email, profile, isEmergencyUser, this.token)
            .then(()=> {
              this.nbContactsAjoutes+=1;
              let message = this.contactsAddedCount + ' contacts ont été ajoutés';
              //this.sendToast(message);
              // this.nav.setRoot(ContactListPage);
            })
            .catch((e)=>console.error(e));
        }else{
          console.log('un contact n\'est pas valide');
          this.wrongContacts.push(contact);
        }
        if(i == indicateur-1){
          resolve();
        }
        i++;
      });

    })

  }

  verifIfValidContact(contact){
    let email = "example@example.fr";
    let phone =  contact.phoneNumbers[0].value;

    let verif = true;

    if(contact.emails!== null){
      //TODO check if it's a real mail
      email = contact.emails[0].value;
    }else{
      verif = this.validateEmail(contact.emails[0].value);
      if(!verif){
        let message= "L'adresse mail d'un de vos contacts est erronée ";
        // this.sendToast(message);
      }
    }

    if(phone.lengh != 10){
      verif = false;
      let message= "Le numéro d'un contact n'est pas valide";
      //  this.sendToast(message);
    }

    return verif;
  }

  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


}
