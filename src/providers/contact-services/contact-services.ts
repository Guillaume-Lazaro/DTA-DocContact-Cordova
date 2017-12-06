import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ApiServicesProvider} from "../api-services/api-services";

@Injectable()
export class ContactServicesProvider {

  constructor(public http: HttpClient, public apiServices: ApiServicesProvider) {
  }


}
