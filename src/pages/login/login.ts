import { Component } from '@angular/core';
import {Events, IonicPage, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import { InscriptionPage } from '../inscription/inscription';
import { ContactListPage } from '../contact-list/contact-list';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserServicesProvider} from "../../providers/user-services/user-services";
import {ContactServicesProvider} from "../../providers/contact-services/contact-services";
import {User} from "../../model/User";
import {Storage} from "@ionic/storage";
import {Contact} from "../../model/Contact";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  phoneNumber: string = '0655545546'; // Supprimer la valeur dans la version finale
  password: string = '0000';    // Supprimer la valeur dans la version finale
  //rememberMe: boolean = false;  //On verra plus tard

  phoneNumberCtrl: FormControl;
  passwordCtrl: FormControl;
  userForm: FormGroup;

  //For Tests
  contacts:any;

  constructor(fb: FormBuilder, private toastCtrl: ToastController, public navCtrl : NavController, public events: Events,
              public userServices : UserServicesProvider, public contactServices: ContactServicesProvider,
              public menuCtrl: MenuController, private storage: Storage) {

    this.userServices = userServices;
    this.menuCtrl.enable(false);
    this.phoneNumberCtrl = fb.control('', [Validators.maxLength(10), Validators.required]);
    this.passwordCtrl = fb.control('', [ Validators.minLength(4), Validators.maxLength(4), Validators.required]);

    this.userForm = fb.group({
      phoneNumber: this.phoneNumberCtrl,
      password: this.passwordCtrl,
    });
  }

  handleSubmit() {
    this.userServices.logTheUser(this.phoneNumber, this.password)
      .then((reponse: any)=>{
        if(reponse.status === 400){
          let toast = this.toastCtrl.create({
            message: 'Le nom d\'utilisateur ou le mot de passe est incorrect',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
        if(reponse.token !== undefined){
          this.userServices.getUser(reponse.token).then((user:any)=> {
            this.userServices.storeUser(new User(user.firstName,user.lastName,user.email,user.phone,user.gravatar,user.profile,reponse.token,[]));
            this.storage.get("user").then(user=>{
              console.log(user.phone)
            });
            this.userServices.token=reponse.token; // Variable de debug, faire autrement pour la version finale
            this.contactServices.getContacts(reponse.token).then( (contacts:any) =>{
              this.storage.get('user').then(user=>{
              for (var contact of contacts) {
                this.contactServices.storeContact(user,
                  contact.firstName,
                  contacts.lastName,
                  contact.phone,
                  contact.email,
                  contact.profile,
                  contact.gravatar,
                  false,
                  contact.id)
              }
              });
              this.contacts = contacts;
              console.log(contacts);
              this.goToContactList(contacts);
            })
              .catch();
          })
            .catch();
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
  goToContactList(params){
    this.navCtrl.setRoot(ContactListPage, {
      'contacts': this.contacts
    });
  }

}
