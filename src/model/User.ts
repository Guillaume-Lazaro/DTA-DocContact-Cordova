import {Person} from "./Person";
import {Contact} from "./Contact";

export class User extends Person{
  constructor(firstName:string, lastName: string,
              email:string, phone:string,
              gravatar: string, profile:string,
              public token:string, public contacts:Array<Contact>){
    super(firstName, lastName, email, phone, gravatar, profile);
  }
}
