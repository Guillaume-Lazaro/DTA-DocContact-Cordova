import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import { InscriptionPage } from '../inscription/inscription';
import { ContactListPage } from '../contact-list/contact-list';
import { ContactServicesProvider } from "../../providers/contact-services/contact-services";

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserServicesProvider} from "../../providers/user-services/user-services";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  phoneNumber: string;
  password: string;
  //rememberMe: boolean = false;  //On verra plus tard

  phoneNumberCtrl: FormControl;
  passwordCtrl: FormControl;
  userForm: FormGroup;
  userServices: UserServicesProvider;

  constructor(fb: FormBuilder, private toastCtrl: ToastController, public navCtrl : NavController,

              public events: Events, userServices : UserServicesProvider) {
    this.userServices = userServices;
    this.phoneNumberCtrl = fb.control('', [Validators.maxLength(10), Validators.required]);
    this.passwordCtrl = fb.control('', [ Validators.minLength(4), Validators.maxLength(4), Validators.required]);


    this.userForm = fb.group({
      phoneNumber: this.phoneNumberCtrl,
      password: this.passwordCtrl,
    });
  }

  handleSubmit() {
    console.log('Je suis dans le handleSubmit');
    let verif = this.password;

    this.userServices.logTheUser(this.phoneNumber, this.password)
      .then((reponse)=>{
        if(reponse.status===400){
          let toast = this.toastCtrl.create({
            message: 'Le nom d\'utilisateur ou le mot de passe est incorrect',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
        if(reponse.token!== undefined){
          this.goToAccueil();
        }
      })
      .catch();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  goToInscription(){
    this.navCtrl.push(InscriptionPage);
  }
  goToAccueil(){
    this.navCtrl.push(ContactListPage);
  }

}
