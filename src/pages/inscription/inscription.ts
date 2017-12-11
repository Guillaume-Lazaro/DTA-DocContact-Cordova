import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserServicesProvider} from "../../providers/user-services/user-services";
import {ApiServicesProvider} from "../../providers/api-services/api-services";

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

  lastName:   string;
  firstName:  string;
  phone:      string;
  email:      string;
  profile:    string;
  password:   string;
  confirmPassword: string;
  profileType: any; //Tableau contenant les types de profile

  lastNameCtrl:   FormControl;
  firstNameCtrl:  FormControl;
  phoneCtrl:      FormControl;
  emailCtrl:      FormControl;
  profileCtrl:    FormControl;
  passwordCtrl:   FormControl;
  confirmPasswordCtrl: FormControl;

  userForm:     FormGroup;
  passwordForm: FormGroup;

  constructor(fb: FormBuilder, private toastCtrl: ToastController, public navCtrl : NavController,
              public events: Events, public apiServices: ApiServicesProvider) {

    this.lastNameCtrl = fb.control('', [Validators.required]);
    this.firstNameCtrl = fb.control('', [Validators.required]);
    this.phoneCtrl = fb.control('', [Validators.minLength(10), Validators.maxLength(10), Validators.required]);
    this.emailCtrl = fb.control('', [Validators.email, Validators.required]);
    this.profileCtrl = fb.control('', Validators.required);

    //TODO récupérer la liste de types de profile via le webservices
    this.apiServices.getProfiles().toPromise()
      .then(profiles =>{
        this.profileType = profiles
      });

    this.userForm = fb.group({
      lastName: this.lastNameCtrl,
      firstName: this.firstNameCtrl,
      phone: this.phoneCtrl,
      email: this.emailCtrl,
      profile: this.profileCtrl,
    });

    this.passwordCtrl = fb.control('', [Validators.minLength(4), Validators.maxLength(4), Validators.required]);
    this.confirmPasswordCtrl = fb.control('', [Validators.required,]);

    this.passwordForm = fb.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, {/*validator: this.matchingPasswords('password', 'confirmPassword')*/});
  }

  handleSubmit() {
    if (this.password == this.confirmPassword) {
      let toast = this.toastCtrl.create({
        message: 'Vous etes inscrit! Bien joué!',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      let toast = this.toastCtrl.create({
        message: 'The confirm password is incorrect',
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
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

  //Mon propre validator!! (inutilisable pour le moment)
  static passwordsMatch(cg: FormGroup): {[err: string]: any} {
    let pwd1 = cg.get('password');
    let pwd2 = cg.get('confirmPassword');
    let rv: {[error: string]: any} = {};
    if ((pwd1.touched || pwd2.touched) && pwd1.value !== pwd2.value) {
      rv['passwordMismatch'] = true;
    }
    return rv;
  }
}
