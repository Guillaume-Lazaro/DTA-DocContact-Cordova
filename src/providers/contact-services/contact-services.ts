import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {ApiServicesProvider} from "../api-services/api-services";

@Injectable()
export class ContactServicesProvider {

  constructor(public http: HttpClient, public apiServices: ApiServicesProvider) {
    console.log('Hello ContactServicesProvider Provider');
  }

  getContacts(token){
    return new Promise(resolve => {
      this.apiServices.getContacts(token).then(contacts=>
        resolve(contacts))
    })
      .catch(error=>{
        console.log(error)
      })
  }

}
