import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';


const API_BASE_URL: string = 'http://familink.cleverapps.io';
const API_PUBLIC: string = '/public';
const API_PRIVATE_MODIFIER: string = "/secured/users";

@Injectable()
export class ApiServicesProvider {

  constructor(public http: HttpClient) {

  }

  SignUpUser(phone, password, firstName, lastName, email, profile){
     return this.http.post(`${API_BASE_URL}${API_PUBLIC}/sign-in?contactsLength=0`,{
        phone: phone,
        password: password,
        firstName: firstName,
        lastName: lastName,
        email: email,
        profile: profile
      },{
        headers:new HttpHeaders().set("Content-Type","application/json")
      })
  }

  getUser(token: string){
    let headers = new HttpHeaders().set("Content-Type","application/json").set("Authorization","Bearer " +token);
      return this.http.get(`${API_BASE_URL}${API_PRIVATE_MODIFIER}/current`, {
        headers: headers
      })
  }

  logUser(phoneInput: string, passwordInput: string) {
    let body = {phone : phoneInput , password: passwordInput};
    console.log('API-PROVIDER', 'login');
    return this.http.post(`${API_BASE_URL}${API_PUBLIC}/login`, body);
  }

  getContacts(token: string){
    let headers = new HttpHeaders().set("Content-Type","application/json").set("Authorization","Bearer " + token);
      return this.http.get(`${API_BASE_URL}${API_PRIVATE_MODIFIER}/contacts`, {
        headers: headers
      })
  }

  getProfiles(){
    let headers = new HttpHeaders().set("Content-Type","application/json");
      return this.http.get(`${API_BASE_URL}${API_PUBLIC}/profiles`, {
        headers: headers
      })
  }

  createContact(firstName: string, lastname: string, phone: string, email: string,profile:string, gravatar: string, emergency, token: string){
    let headers = new HttpHeaders().set("Content-Type","application/json").set("Authorization","Bearer " + token);
     return this.http.post(`${API_BASE_URL}${API_PRIVATE_MODIFIER}/contacts`, {
        phone:phone,
        firstName: firstName,
        lastName: lastname,
        email: email,
        profile: profile,
        gravatar: gravatar,
        isFamilinkUser: emergency,
        isEmergencyUser: emergency
      },{
        headers: headers
      })
  }

  deleteContact(id: string, token: string){
    let headers = new HttpHeaders().set("Content-Type","application/json").set("Authorization","Bearer " + token);
    return this.http.delete(`${API_BASE_URL}${API_PRIVATE_MODIFIER}/contacts/${id}`,{
      headers: headers
    })
  }
  forgotPassword(phone: string){
    let headers = new HttpHeaders().set("Content-Type","application/json");
      return this.http.post(`${API_BASE_URL}${API_PUBLIC}/forgot-password`,{
        phone: phone
      } ,{
        headers: headers
    });
  }

  updateContact(firstName: string, lastname: string, phone: string, email: string,profile:string, gravatar: string, emergency, token: string, id: string){
    let headers = new HttpHeaders().set("Content-Type","application/json").set("Authorization","Bearer " + token);
    return this.http.put(`${API_BASE_URL}${API_PRIVATE_MODIFIER}/contacts/${id}`, {
      phone:phone,
      firstName: firstName,
      lastName: lastname,
      email: email,
      profile: profile,
      gravatar: gravatar,
      isFamilinkUser: emergency,
      isEmergencyUser: emergency
    },{
      headers: headers
    })
  }


  // getList() {
  //   return this.http.get(`${API_BASE_URL}${API_USERS}`);
  // }
  //
  // addTodos(todo){
  //   return this.http.post(`${API_BASE_URL}${API_USERS}`,todo);
  // }
  //
  // deleteTodos(todo){
  //   console.log('id à suppr :'+todo.id)
  //   return this.http.delete(`${API_BASE_URL}${API_USERS}/${todo.id}`);
  // }
  //
  // modifyTodo(todo){
  //   return this.http.put(`${API_BASE_URL}${API_USERS}/${todo.id}`,todo);
  //
  // }


}
