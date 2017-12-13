import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from "../../model/User";
import { Contact } from "../../model/Contact";
import { Contacts } from "@ionic-native/contacts";
import { ContactServicesProvider } from "../contact-services/contact-services";
import { ApiServicesProvider } from "../api-services/api-services";
import { Storage } from "@ionic/storage";
import { AlertController, ToastController } from "ionic-angular";

@Injectable()
export class ImportServicesProvider {

  profiles :any;
  token : string;
  contactsAddedCount: number;
  wrongContacts : Array<any> = [];
  nbContactsAjoutes = 0;

  constructor(public http: HttpClient, private contacts: Contacts, private contactServices: ContactServicesProvider,
              private storage: Storage, private apiServices: ApiServicesProvider, private toastCtrl: ToastController,
              private alertCtrl: AlertController) {
    this.getProfileTypes();
  }

  importContacts(){
    return new Promise((resolve) => {
    this.wrongContacts = [];
    this.nbContactsAjoutes = 0;
    this.contacts.find([name]).then((repertoireContacts : any) =>{                      // Get contacts from phone book
      let distantList;
      repertoireContacts= this.filterUnwantedContacts(repertoireContacts);                              // Clean the list of contacts

      this.storage.get('user').then((user: User) => {                                         // Get remote contacts
        this.token = user.token;
        this.contactServices.getContacts(user.token).then((contacts:Array<Contact>) => {
          let knownContactsArray = repertoireContacts.map((contact : any)=>{                            // Loop over the contacts from the phone book in order to find the ones that share a phone number with the remote db
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
              if(this.wrongContacts.length>0){                                                            // If there are some contacts that were not added, we prepare a special alert
                let names = '';
                let title='';
                this.wrongContacts.forEach((contact)=>{
                  names += contact.displayName + ', ';
                });
                names = names.substring(0, names.length-2);
                let message = "Il y a eu un problème avec les contacts : "+names;
                if(this.nbContactsAjoutes == 1){
                  title = this.nbContactsAjoutes+" contact a été ajouté";
                }else{
                  title = this.nbContactsAjoutes+" contacts ont étés ajoutés";
                }
                this.showAlert(title, message);
              }
              console.log('traitement fini');
              resolve();                                                                                    // End of the import
            });
          }else{
            let message = 'Tous les contacts de votre répertoire ont déjà été ajoutés';
            this.sendToast(message);
          }
        })
          .catch(error => console.log("erreur get contacts" + error))
      })
        .catch(error => console.log("erreur get user local" + error))

    })
    })
  }



  filterUnwantedContacts(contactArray){                                                                    // Here we check if the contact has at least a firstName, lastName and a phone number
    let filteredArray = contactArray.filter((contact)=> {
      return contact.name.familyName!=null && contact.name.givenName!=null && contact.phoneNumbers != null ;
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
    return new Promise((resolve)=>{                                                                 // Promise used in order to wait for all contacts to be added
      let i = 0;
      let indicateur = newContacts.length;
      newContacts.map((contact)=>{
        let phone =  contact.phoneNumbers[0].value;
        let profile = this.profiles[0];
        let isEmergencyUser = false;
        let email: any;

        let verif = this.verifIfValidContact(contact);                                                      // Verification if the informations of the contact are valid
        email = verif.mail;

        if(verif.verif){                                                                                    // If it's verified, we add the contact to the remote db
          console.log("On va ajouter : "+ contact.name.givenName, contact.name.familyName, phone, email, profile, isEmergencyUser, this.token);
          this.nbContactsAjoutes+=1;
          this.contactServices.createContact(contact.name.givenName, contact.name.familyName, phone, email, profile, isEmergencyUser, this.token)
            .then(()=> {
              console.log(contact +' a été ajoutés');
              //this.sendToast(message);
              // this.nav.setRoot(ContactListPage);
            })
            .catch((e)=>console.error(e));
        }else{
          console.log('un contact n\'est pas valide');
          this.wrongContacts.push(contact);                                                                 // If the contact is not valid, we keep track of it
        }
        if(i == indicateur-1){
          resolve();                                                                                         // Get out of the promise when all the contacts were checked
        }
        i++;
      });
    })
  }

  verifIfValidContact(contact){
    let email = "example@example.fr";
    let phone =  contact.phoneNumbers[0].value;
    let verif = true;

    if(contact.emails !== null && contact.emails[0].value !== null){                                          // Verif the mail
      verif = this.validateEmail(contact.emails[0].value);
      if(!verif) {
        console.log("L'adresse mail d'un de vos contacts est erronée ");
        // this.sendToast(message);
      }else{
        email = contact.emails[0].value;
      }
    }
    if(phone.length !== 10){                                                                                  // Verif the phone
      verif = false;
      console.log("Le numéro d'un contact n'est pas valide, il a "+phone.length+ " num ");
    }
    let reponse = {
      verif : verif,
      mail : email
    };
    return reponse;
  }

  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log("le mail est valide ? "+re.test(email));
    return re.test(email);
  }

  showAlert(titre, message){
      let alert = this.alertCtrl.create({
        title: titre,
        subTitle: message,
        buttons: ['Retour']
      });
      alert.present();
  }

}
