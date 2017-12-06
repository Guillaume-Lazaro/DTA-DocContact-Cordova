import {Person} from "./Person";

export class Contact extends Person{
  constructor( firstName:string, lastName: string,
               email:string, phone:string,
               gravatar: string, profile:string,
               public id:string, public isEmergencyUser:string,
               public isFamilylinkUser:string ){
    super(firstName, lastName, email, phone, gravatar, profile)
  }
}
