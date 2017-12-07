import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';



const API_BASE_URL: string = 'http://familink.cleverapps.io/';
//const API_BASE_URL: string = 'http://10.1.0.201:8080/';
const API_USERS: string = 'secured/users/contacts';

@Injectable()
export class ApiServicesProvider {

  constructor(public http: HttpClient) {

  }
  // UTILISER LA METHODE CHOISIE

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

  getContacts(token){
    var headers = new HttpHeaders().set("Content-Type","application/json").set("Authorization","Bearer " + token);
    return new Promise(resolve =>{
      this.http.get(API_BASE_URL + API_USERS, {
        headers: headers
      })
        .subscribe(data => {
          resolve(data);
        }, err=>{
          console.log(err);
        });
    });
  }
}
