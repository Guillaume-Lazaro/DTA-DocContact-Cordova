import { HttpClient } from '@angular/common/http';
import {Injectable, ViewChild} from '@angular/core';
import { User } from "../../model/User";
import { Contact } from "../../model/Contact";
import { Contacts } from "@ionic-native/contacts";
import { ContactServicesProvider } from "../contact-services/contact-services";
import { ApiServicesProvider } from "../api-services/api-services";
import { Storage } from "@ionic/storage";
import {Nav, ToastController} from "ionic-angular";
import {ContactListPage} from "../../pages/contact-list/contact-list";
import * as _ from 'lodash';

@Injectable()
export class ImportServicesProvider {

 // @ViewChild(Nav) nav: Nav;

  profiles :any;
  token : string;

  constructor(public http: HttpClient, private contacts: Contacts, private contactServices: ContactServicesProvider,
              private storage: Storage, private apiServices: ApiServicesProvider, private toastCtrl: ToastController) {
    // Get the profiles at the beginning
    this.getProfileTypes();
  }

  importContacts(){
    this.contacts.find([name]).then((repertoireContacts : any) =>{                                      // Get contacts from phone book
      let distantList;
      repertoireContacts= this.filterUnwantedContacts(repertoireContacts);                              // Clean the list of contacts

      this.storage.get('user').then((user: User) => {                                         // Get remote ccontacts
        this.token = user.token;
        this.contactServices.getContacts(user.token).then((contacts:Array<Contact>) => {
          let contactsAddedCount;
          distantList = contacts;
          console.log('après nettoyage :');
          console.log(repertoireContacts);
          // Compare the contacts from the database with the contacts from the phone
          // The newContactsFilter is the list of contacts known in the distant database



            let knownContactsFilter = repertoireContacts.map((contact : any)=>{
              const result = distantList.filter((serverContact: any)=> {
                // if(contact.name.familyName == oldContact.lastName && contact.phoneNumbers[0].value === oldContact.phone && contact.name.lastName == oldContact.firstName
                // )
                return contact.phoneNumbers[0].value === serverContact.phone;
              });
              return result;
            });
            console.log(knownContactsFilter);

          knownContactsFilter = knownContactsFilter.filter((array)=>{
            return array.length>0;
          });

          // knownContactFilter represente les contacts qui sont en commun avec la remode db
          let newArr : Array<any> = [];
          knownContactsFilter.forEach((array)=> {
            let previousItem:any = 0;
            for(let i = 0; i<array.length;i++){
              if(previousItem!= 0 && array[i].firstName===previousItem.firstName &&  array[i].lastName===previousItem.lastName &&  array[i].phone===previousItem.phone){

              }else{
                newArr.push(array[i]);
              }
              previousItem = array[i];
            }
          });
          knownContactsFilter = newArr;

          console.log('le array épuré est ');
          console.log(newArr);


          let contactsToAdd = repertoireContacts;

          knownContactsFilter.forEach((knownContact)=>{
            let phone = knownContact.phone;
            console.log(phone);
            contactsToAdd.map((contact)=>{
              if(contact.phoneNumbers[0].value == phone){
                console.log('match');
                contactsToAdd.pop(contact)
              }
            })
          });



          console.log("contacts to add");
          console.log(contactsToAdd);

          contactsAddedCount = contactsToAdd.length;

          if(contactsAddedCount>0){
            contactsToAdd.map((contact)=>{
              let email = "example@example.fr";
              console.log(this.profiles);
              let profile = this.profiles[0];
              let isFamilylinkUser = false;
              let isEmergencyUser = false;

              if(contact.emails!== null){
                //TODO check if it's a real mail
                email = contact.emails;
              }
              console.log("On va ajouter : "+ contact.name.givenName, contact.name.familyName,  contact.phoneNumbers[0].value, email)
              this.contactServices.createContact(contact.name.givenName, contact.name.familyName, contact.phoneNumbers[0].value, email, profile, isEmergencyUser, this.token)
                .then(()=> {
                  let message = contactsAddedCount + 'contacts qui ont été ajoutés';
                  let toast = this.toastCtrl.create({
                    message: message,
                    duration: 3000,
                    position: 'bottom'
                  });
                  toast.present();

                  // this.nav.setRoot(ContactListPage);
                });

            });
          }else{
            let message = 'Tous les contacts de votre répertoire ont déjà été ajoutés';
            let toast = this.toastCtrl.create({
              message: message,
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
          }

          console.log('il y a '+contactsAddedCount+ ' contacts qui ont été ajoutés');


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


}
