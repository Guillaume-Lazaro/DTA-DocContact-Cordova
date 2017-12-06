import {Person} from "./Person";

export class User extends Person{
  constructor(firstName:string, lastName: string,
              email:string, phone:string,
              gravatar: string, profile:string,
              public token:string){
    super(firstName, lastName, email, phone, gravatar, profile);
  }
}
