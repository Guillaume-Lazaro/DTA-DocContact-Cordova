import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ApiServicesProvider} from "../api-services/api-services";

@Injectable()
export class ContactServicesProvider {

  constructor(public http: HttpClient, public apiServices: ApiServicesProvider) {
  }

  logTheUser(login: string, password: string){
    return new Promise((resolve) => {
      this.apiServices.logUser(login, password).toPromise()
        .then((message)=> {
          resolve(message)
        })
        .catch((e)=> console.error(e))
    })
  }
}
