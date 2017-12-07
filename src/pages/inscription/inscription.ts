import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

/**
 * Generated class for the InscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-inscription',
  templateUrl: 'inscription.html',
})
export class InscriptionPage {

  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  profile: string;
  //profile2: string;
  profileType: any;

  password: string;

  lastNameCtrl: FormControl;
  firstNameCtrl: FormControl;
  phoneCtrl: FormControl;
  emailCtrl: FormControl;
  profileCtrl: FormControl;
  passwordCtrl: FormControl;
  userForm: FormGroup;

  //profile2Ctrl: FormControl;

  constructor(fb: FormBuilder, private toastCtrl: ToastController, public navCtrl : NavController,
              public events: Events) {

    this.lastNameCtrl = fb.control('', [Validators.required]);
    this.firstNameCtrl = fb.control('', [Validators.required]);
    this.phoneCtrl = fb.control('', [Validators.minLength(10), Validators.maxLength(10), Validators.required]);
    this.emailCtrl = fb.control('', [Validators.email, Validators.required]);
    this.profileCtrl = fb.control('', Validators.required);
    this.passwordCtrl = fb.control('', [ Validators.minLength(4), Validators.maxLength(4), Validators.required]);
    //TODO password verification

    this.profile = 'senior';
    this.profileType = [
      { text: 'Doctor', value: 'doctor' },
      { text: 'Senior', value: 'senior' },
      { text: 'Family', value: 'family' },
    ];

    //Test:
    //this.profileCtrl = fb.control('', Validators.required);

    this.userForm = fb.group({
      lastName: this.lastNameCtrl,
      firstName: this.firstNameCtrl,
      phone: this.phoneCtrl,
      email: this.emailCtrl,
      profile: this.profileCtrl,
      password: this.passwordCtrl,
      //profile2: this.profile2Ctrl
    });
  }

  handleSubmit() {
    let toast = this.toastCtrl.create({
      message: 'Vous etes inscrit! Bien joué!',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InscriptionPage');


  }

  testButton() {
    let toast = this.toastCtrl.create({
      message: 'Profile = '+this.profile,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();

    console.log('Profile = '+this.profile);
  }

}
