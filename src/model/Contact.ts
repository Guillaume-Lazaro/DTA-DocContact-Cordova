import {Person} from "./Person";

export class Contact extends Person{
  constructor( firstName:string, lastName: string,
               email:string, phone:string,
               gravatar: string, profile:string,
               public id:string, public isEmergencyUser:boolean,
               public isFamilylinkUser:boolean){
    super(firstName, lastName, email, phone, gravatar, profile)
  }
}
