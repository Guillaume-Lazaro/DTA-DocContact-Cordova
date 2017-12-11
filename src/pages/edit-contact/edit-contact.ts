import { Component } from '@angular/core';
import {AlertController, Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ContactServicesProvider} from "../../providers/contact-services/contact-services";
import {UserServicesProvider} from "../../providers/user-services/user-services";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiServicesProvider} from "../../providers/api-services/api-services";

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
              public events: Events, public apiServices: ApiServicesProvider, public alertCtrl: AlertController) {

    this.lastNameCtrl = fb.control('', [Validators.required]);
    this.firstNameCtrl = fb.control('', [Validators.required]);
    this.phoneCtrl = fb.control('', [Validators.minLength(10), Validators.maxLength(10), Validators.required]);
    this.emailCtrl = fb.control('', [Validators.email, Validators.required]);
    this.profileCtrl = fb.control('', Validators.required);

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

    if (this.navParams.get('contact') != undefined) {
      this.contact = this.navParams.get('contact');
      this.isInEditMode = true;
      this.fillFields();
    }
  }

  handleSubmit() {
    var toastMessage;
    if (this.isInEditMode) {
      toastMessage = 'Le contact a bien été modifié';
      //TODO implémenter editContact() depuis contact-services
    } else {
      //Création
      toastMessage = 'Le contact a bien été ajouté';
      this.contactServices.createContact(this.firstName,this.lastName,this.phone,this.email,this.profile, false, this.userServices.token)
        .then((reponse: any)=>{
          console.log('Reponse: '+reponse);
        })
        .catch(error=>{
          console.log(error)
        });

    }

    let toast = this.toastCtrl.create({
      message: toastMessage,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
    this.navCtrl.pop();
  }

  ionViewDidLoad() { }

  deleteContact() {
    let alert = this.alertCtrl.create({
      title: 'Delete ?',
      message: 'Do you want to delete this contact ?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            console.log('Delete clicked');
            console.log('Je delete le contact '+this.contact.id);
            this.contactServices.deleteContact(this.contact.id, this.userServices.token)
              .then((reponse:any)=> {
                console.log('reponse '+reponse);
                this.navCtrl.popToRoot();   //TODO réparer cette merde (=> error 400)
              })
              .catch(error=> {
                console.log('error');
            });
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

}
