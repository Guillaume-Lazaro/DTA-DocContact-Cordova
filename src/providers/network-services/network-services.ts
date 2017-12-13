import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkProvider {

  constructor(public http: HttpClient, private networkState: Network) {
    console.log('Hello NetworkProvider Provider');
  }

  checkConnection(): boolean {
    return this.networkState.type !== 'none';
  }



}
