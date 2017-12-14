import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ApiServicesProvider} from "../api-services/api-services";
import {Contact} from "../../model/Contact";
import {Storage} from "@ionic/storage";
import {Events} from "ionic-angular";
import {ErrorServicesProvider} from "../error-services/error-services";


@Injectable()
export class ContactServicesProvider {

  constructor(public http: HttpClient, public apiServices: ApiServicesProvider, private storage: Storage, public event: Events, public errorServices: ErrorServicesProvider) {
    console.log('Hello ContactServicesProvider Provider');
  }

  getContacts(token: string){
    return new Promise(resolve => {
      this.apiServices.getContacts(token).toPromise().then((contacts: any)=>{
        let contactsArray = [];
        for (let contact of contacts){
          contactsArray.push(new Contact(contact.firstName,contact.lastName,contact.email,contact.phone,contact.gravatar,contact.profile,contact._id,false,false))
        }
        resolve(contactsArray)
      })
        .catch(error=>{
          console.log(error)
        })
    })
  }

  createContact(firstName: string, lastName: string, phone: string, email: string, profile: string, emergency: boolean, token: string){
    let gravatar = this.apiServices.createGravatar(email);
    return new Promise( resolve =>{
      this.apiServices.createContact(firstName, lastName, phone, email, profile, gravatar, emergency, token).toPromise().then( contact=>{
        resolve(contact)
      }).catch(error=>{
        console.log(error)
      })
        .catch(error=>{
          console.log(error)
        })
    })

  }

  updateContact(firstName: string, lastName: string, phone: string, email: string, profile: string, emergency: boolean, token: string, id: string){
    let gravatar = this.apiServices.createGravatar(email);
    return new Promise( resolve => {
      this.apiServices.updateContact(firstName, lastName, phone, email, profile, gravatar, emergency, token, id).toPromise().then(contact => {
        resolve(contact)
      })
        .catch(error => {
          if(error.status ==401){
            this.errorServices.invalidToken()
            console.log("erreur");
            this.event.publish('tokenError',"token non valide")
          }
        console.log(error.status)
      })
    })
  }

  deleteContact(id: string, token: string){
    return new Promise( resolve=> {
      this.apiServices.deleteContact(id, token).toPromise().then( reponse=>{
        resolve(reponse)
      })
        .catch(error=>{
          console.log(error)
        })
    })
  }

}
