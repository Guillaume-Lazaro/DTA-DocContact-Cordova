import { Component } from '@angular/core';
import {Events, IonicPage, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import { InscriptionPage } from '../inscription/inscription';
import { ContactListPage } from '../contact-list/contact-list';
import { ContactServicesProvider } from "../../providers/contact-services/contact-services";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserServicesProvider} from "../../providers/user-services/user-services";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(fb: FormBuilder, private toastCtrl: ToastController, public navCtrl : NavController, public events: Events, public userServices : UserServicesProvider,  public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false);
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
      .then((reponse: any)=>{
        if(reponse.status === 400){
          let toast = this.toastCtrl.create({
            message: 'Le nom d\'utilisateur ou le mot de passe est incorrect',
            duration: 3000,
            position: 'bottom'
          });
          toast.present().then();
        }
        if(reponse.token !== undefined){
          this.userServices.getUser(reponse.token).then(user=> {
            console.log(user)
          });
          this.goToAccueil();
        }
      })
      .catch();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

  }

  goToInscription(){
    this.userServices.getUser("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6IjA2MDAwMDAwMDIiLCJpYXQiOjE1MTI2MzYzNTMsImV4cCI6MTUxMjYzNjY1M30.C03-9hKd_kI0F3Og6LVTHa-veAdhEBqjPeUk5UZCNFk")
      .then(data => {
        console.log(data);
        this.navCtrl.push(InscriptionPage).then();
      })

  }
  goToAccueil(){
    this.navCtrl.push(ContactListPage);
  }

}
