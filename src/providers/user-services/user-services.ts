import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ApiServicesProvider} from "../api-services/api-services";
import {User} from "../../model/User";
import {Storage} from "@ionic/storage";

/*
  Generated class for the UserServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServicesProvider {
  // token: string; // variable de Debug : a enlever pour la fin !
  constructor(public http: HttpClient, public apiServices: ApiServicesProvider, private storage: Storage) {
    console.log("Hello UserServicesProvider Provider");
  }

  logTheUser(login: string, password: string){
    return new Promise((resolve) => {
      this.apiServices.logUser(login, password).toPromise()
        .then((message)=> {
          resolve(message);
        })
        .catch( error=> {
        console.log(error)
      })
    })
  }

  getUser(token: string){
    return new Promise( resolve =>{
      this.apiServices.getUser(token).toPromise().then( (userJson:any)=>{
        let userGravatar = this.apiServices.createGravatar(userJson.email);
        let user = new User(userJson.firstName, userJson.lastName,userJson.email,userJson.phone,userGravatar,userJson.profile,token,[]);
        resolve(user)
      })
        .catch(error=>{
        console.log(error)
      });
    })
      .catch(error=>{
        console.log(error)
      })
  }

  createUser(phone: string, password: string, firstName: string,lastName: string, email: string, profile: string){
    return new Promise (resolve=>{
      this.apiServices.SignUpUser(phone, password, firstName, lastName, email, profile).toPromise().then( (user: any)=>{
        resolve(user)
      })
        .catch(error=>{
        console.log(error)
      })
    })
  }

  updateUser(firstName: string, lastName: string, email: string, profile: string, token: string){
    return new Promise( resolve => {
      this.apiServices.updateUser(firstName, lastName, email, profile, token).toPromise().then((user:any) =>{
        this.storage.get('user').then((userloc:User)=>{
          this.storage.set('user',new User(user.firstName,user.lastName,user.email,user.phone,this.apiServices.createGravatar(user.email),user.profile,token,userloc.contacts)).then(()=>
          resolve(userloc))
        })
          .catch(error=>console.log("erreur get user update user"));
      })
    })
      .catch(error=>{
        console.log(error)
      })
  }


}
