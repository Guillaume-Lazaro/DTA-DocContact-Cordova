import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {ApiServicesProvider} from "../api-services/api-services";
import { Md5 } from "ts-md5/dist/md5"

@Injectable()
export class ContactServicesProvider {

  constructor(public http: HttpClient, public apiServices: ApiServicesProvider) {
    console.log('Hello ContactServicesProvider Provider');
  }

  getContacts(token: string){
    return new Promise(resolve => {
      this.apiServices.getContacts(token).then(contacts=>
        resolve(contacts))
    })
      .catch(error=>{
        console.log(error)
      })
  }
  createContacts(firstName: string, lastName: string, phone: string, email: string, profile: string, emergency: boolean, token: string){
    var gravatar = this.createGravatar(email);
    return new Promise( resolve =>{
      this.apiServices.createContact(firstName, lastName, phone, email, profile, gravatar, emergency, token).toPromise().then( contact=>{
        resolve(contact)
      })
    });
  }
  createGravatar(mail: string){
    var mailMd5 = Md5.hashStr(mail.trim().toLowerCase());
    var gravatar = `https://www.gravatar.com/avatar/${mailMd5}`;
    return gravatar;
  }
}
