import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ApiServicesProvider} from "../api-services/api-services";

/*
  Generated class for the ContactServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ContactServicesProvider {

  constructor(public http: HttpClient, public apiServices: ApiServicesProvider) {
    console.log('Hello ContactServicesProvider Provider');
  }
  // ON VA GERER ICI LES CONTACTS


  //EXEMPLE :
  // movieList: Array<Movie> = [];
  // getList(){
  // return new Promise(((resolve) => {
  //   this.apiServices.getList().toPromise()
  //     .then((items)=> {
  //       resolve(items)
  //     })
  //     .catch((e)=> console.error(e))
  // }))
  //
  // }
  //
  // returnListMovie(list){
  //   this.movieList=list.map((item)=> {
  //     return new Movie(item.title,
  //       item.releasedate,
  //       item.studio,
  //       item.poster,
  //       item.location,
  //       item.rating,
  //       item.genre,
  //       item.directors,
  //       item.actors,
  //       item.trailers
  //     )
  //   });
  //
  //   this.movieList=_.orderBy(this.movieList,'title','asc');
  //
  //   console.log(this.movieList)
  //   return this.movieList;
  // }
}
