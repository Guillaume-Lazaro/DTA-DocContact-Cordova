import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import { InscriptionPage } from '../inscription/inscription';
import { ContactListPage } from '../contact-list/contact-list';
import { ContactServicesProvider } from "../../providers/contact-services/contact-services";

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";


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

  constructor(fb: FormBuilder, private toastCtrl: ToastController, public navCtrl : NavController,
              public events: Events, contactService : ContactServicesProvider) {

    contactService.logTheUser('6666666666', '0000').then((token)=>(console.log(token)));
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

    if (verif == '0000') {
      let toast = this.toastCtrl.create({
        message: 'Vous etes connecté',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
      this.goToAccueil();
    } else {
      let toast = this.toastCtrl.create({
        message: 'Mot de passe incorrect (c\'est 0000)',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
    //A utiliser quand ready

    //Cette partie sera à remplacer par la vrai vérification sur le réseau tout ça
    //Actuellement, n'importe quel numéro de téléphone (à 10 chiffres) avec '0000' comme mdp marche
    /*
    if(known && this.rememberMe){
      this.storage.set('auth', true);
      this.storage.set('email', this.email);
      this.storage.set('password', this.password);

      this.goToMainPage();
    }
    if(known && !this.rememberMe){
      console.log('go')
      this.storage.set('auth', true);
      this.goToMainPage();
    }
    */

    /*let toast = this.toastCtrl.create({
      message: 'L\'utilisateur n\'existe pas ou le mot de passe est incorrecte ',
      duration: 3000,
      position: 'bottom'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();*/
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
