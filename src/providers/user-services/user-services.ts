import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import {ApiServicesProvider} from "../api-services/api-services";

/*
  Generated class for the UserServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServicesProvider {

  constructor(public http: HttpClient, public apiServices: ApiServicesProvider) {
    console.log('Hello UserServicesProvider Provider');
  }

  logTheUser(login: string, password: string){
    return new Promise((resolve) => {
      this.apiServices.logUser(login, password).toPromise()
        .then((message)=> {
          resolve(message)
        })
        .catch((e)=> (resolve(e)))
    })
  }
}
