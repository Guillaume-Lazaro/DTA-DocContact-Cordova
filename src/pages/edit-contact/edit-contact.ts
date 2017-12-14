import { Component } from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ContactServicesProvider} from "../../providers/contact-services/contact-services";
import {UserServicesProvider} from "../../providers/user-services/user-services";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiServicesProvider} from "../../providers/api-services/api-services";
import {User} from "../../model/User";
import {Storage} from "@ionic/storage";
import { TranslateService } from '@ngx-translate/core';
import {LoginPage} from "../login/login";

/**
 * Generated class for the EditContactPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-contact',
  templateUrl: 'edit-contact.html',
})
export class EditContactPage {

  contact:any;
  isInEditMode:boolean = false;

  lastName:   string;
  firstName:  string;
  phone:      string;
  email:      string;
  profile:    string;
  profileType: any; //Tableau contenant les types de profile

  lastNameCtrl:   FormControl;
  firstNameCtrl:  FormControl;
  phoneCtrl:      FormControl;
  emailCtrl:      FormControl;
  profileCtrl:    FormControl;

  userForm:     FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, public contactServices: ContactServicesProvider,
              public userServices: UserServicesProvider, fb: FormBuilder, private toastCtrl: ToastController,
              public events: Events, public apiServices: ApiServicesProvider, public alertCtrl: AlertController,
              private storage: Storage, private translateService: TranslateService) {

    this.lastNameCtrl = fb.control('', [Validators.required]);
    this.firstNameCtrl = fb.control('', [Validators.required]);
    this.phoneCtrl = fb.control('', [Validators.minLength(10), Validators.maxLength(10), Validators.required]);
    this.emailCtrl = fb.control('', [Validators.email, Validators.required]);
    this.profileCtrl = fb.control('', Validators.required);

    this.storage.get('profiles').then(profiles=>{
      this.profileType = profiles
    }).catch(error=>console.log(error));

    this.userForm = fb.group({
      lastName: this.lastNameCtrl,
      firstName: this.firstNameCtrl,
      phone: this.phoneCtrl,
      email: this.emailCtrl,
      profile: this.profileCtrl,
    });

    if (this.navParams.get('contact') != undefined) {
      this.contact = this.navParams.get('contact');
      this.isInEditMode = true;
      this.fillFields();
    }
  }

  handleSubmit() {
    let toastMessage;
    this.lastName = this.capitalize(this.lastName);

    if (this.isInEditMode) {
      //Modification
      toastMessage = this.translateService.instant('contactModified');
      this.storage.get('user').then((user:User)=>{
        this.contactServices.updateContact(this.firstName,this.lastName,this.phone,this.email,this.profile, false, user.token, this.contact.id)
          .then((reponse: any)=>{
            let toast = this.toastCtrl.create({
              message: toastMessage,
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            this.navCtrl.popToRoot(); //TODO à changer dans le futur
          })
          .catch(error=>{
            console.log(error)});
      })
    } else {
      //Création
      toastMessage = this.translateService.instant('contactAdded');
      this.storage.get('user').then((user:User)=>{
        this.contactServices.createContact(this.firstName,this.lastName,this.phone,this.email,this.profile, false, user.token)
          .then((reponse: any)=>{
            let toast = this.toastCtrl.create({
              message: toastMessage,
              duration: 3000,
              position: 'bottom'
            });
            toast.present();
            this.navCtrl.popToRoot();
          })
          .catch(error=>{
            console.log(error)
          });
      })
    }
  }

  ionViewDidLoad() {
    this.events.subscribe('no login' , ()=>{
      this.navCtrl.setRoot(LoginPage)
    })
  }

  deleteContact() {
    let alert = this.alertCtrl.create({
      title: this.translateService.instant('confirmation'),
      message: this.translateService.instant('deleteConfirmation'),
      buttons: [
        {
          text: this.translateService.instant('no'),
          handler: () => {}
        },
        {
          text: this.translateService.instant('delete'),
          handler: () => {
            this.storage.get('user').then((user:User)=>{
              this.contactServices.deleteContact(this.contact.id, user.token)
                .then((reponse: any)=>{
                  this.navCtrl.popToRoot();
                })
                .catch(error=>{ console.log(error) });
            })
          }
        }
      ]
    });

    alert.present();
  }

  fillFields() {
    this.lastName = this.contact.lastName;
    this.firstName = this.contact.firstName;
    this.phone = this.contact.phone;
    this.email = this.contact.email;
    this.profile = this.contact.profile;
  }

  //ça sert juste à mettre en lettre capitale la premiére lettre du nom de famille, afin de faciliter le tri alphabétique
  capitalize(name:string): string {
    let firstLetter = name.charAt(0).toLocaleUpperCase();
    return firstLetter + name.substring(1);
  }
}
