import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {ContactServicesProvider} from "../../providers/contact-services/contact-services";
import {UserServicesProvider} from "../../providers/user-services/user-services";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

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
              public userServices: UserServicesProvider, fb: FormBuilder, private toastCtrl: ToastController, public events: Events) {

    this.lastNameCtrl = fb.control('', [Validators.required]);
    this.firstNameCtrl = fb.control('', [Validators.required]);
    this.phoneCtrl = fb.control('', [Validators.minLength(10), Validators.maxLength(10), Validators.required]);
    this.emailCtrl = fb.control('', [Validators.email, Validators.required]);
    this.profileCtrl = fb.control('', Validators.required);

    //TODO récupérer la liste de types de profile via le webservices
    this.profile = 'senior';  //Valeur par défaut
    this.profileType = [      //text= ce qui est affiché, value= la "vraie" valeur
      { text: 'Doctor', value: 'doctor' },
      { text: 'Senior', value: 'senior' },
      { text: 'Family', value: 'family' },
    ];

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
    } else {
      //this.isInEditMode = false;
    }

    this.fillFields();
  }

  handleSubmit() {
    let toast = this.toastCtrl.create({
      message: 'Le contact a bien été modifié',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
  }

  fillFields() {
    if (this.isInEditMode) {
      this.lastName = this.contact.lastName;
      this.firstName = this.contact.firstName;
      this.phone = this.contact.phone;
      this.email = this.contact.email;
      this.profile = this.contact.profile;
    } else {
      this.lastName = 'Unknown merde!';
    }

  }

}
