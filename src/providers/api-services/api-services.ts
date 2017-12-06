import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


//const API_BASE_URL: string = 'http://localhost:8080/';
//const API_BASE_URL: string = 'http://10.1.0.201:8080/';
//const API_USERS: string = 'trailers';

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
}
