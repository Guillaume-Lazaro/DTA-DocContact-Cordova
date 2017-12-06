import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';


const API_BASE_URL: string = 'http://familink.cleverapps.io';
const API_PUBLIC: string = '/public';
//const API_SECURE: string = '/secured/users';

@Injectable()
export class ApiServicesProvider {

  constructor(public http: HttpClient) {

  }

  logUser(phoneInput: String, passwordInput: String) {
    let body = {phone : phoneInput , password: passwordInput};
    console.log('API-PROVIDER', 'login');
    return this.http.post(`${API_BASE_URL}${API_PUBLIC}/login`, body);
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
