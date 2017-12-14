import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavOptions, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserServicesProvider} from "../../providers/user-services/user-services";
import {ContactListPage} from "../contact-list/contact-list";
import {ApiServicesProvider} from "../../providers/api-services/api-services";
import {User} from "../../model/User";
import {Storage} from "@ionic/storage";
import {NetworkProvider} from "../../providers/network-services/network-services";
import {TranslateService} from "@ngx-translate/core";

/**
 * Generated class for the EditUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-user',
  templateUrl: 'edit-user.html',
})
export class EditUserPage {

  user:User;

  lastName:   string;
  firstName:  string;
  email:      string;
  profile:    string;
  profileType: any; //Tableau contenant les types de profile

  lastNameCtrl:   FormControl;
  firstNameCtrl:  FormControl;
  emailCtrl:      FormControl;
  profileCtrl:    FormControl;

  userForm:     FormGroup;

  constructor(public navCtrl: NavController,public navParams: NavParams,public userServices: UserServicesProvider,
              fb: FormBuilder, private toastCtrl: ToastController,public events: Events,
              public apiServices: ApiServicesProvider, public translateServices: TranslateService, private storage: Storage, public networkServices: NetworkProvider) {

    this.lastNameCtrl = fb.control('', [Validators.required]);
    this.firstNameCtrl = fb.control('', [Validators.required]);
    this.emailCtrl = fb.control('', [Validators.email, Validators.required]);
    this.profileCtrl = fb.control('', Validators.required);

    this.storage.get('profiles').then(profiles=>{
      this.profileType = profiles
    }).catch(error=>console.log(error));

    this.userForm = fb.group({
      lastName: this.lastNameCtrl,
      firstName: this.firstNameCtrl,
      email: this.emailCtrl,
      profile: this.profileCtrl,
    });
  }


  handleSubmit() {
    let toastMessage;
    if (this.networkServices.isConnect()) {
      toastMessage = this.translateServices.instant('userProfileModified');
      //Modification du profile
      this.userServices.updateUser(this.firstName, this.lastName, this.email, this.profile, this.user.token)
        .then((reponse: any) => {
          console.log(this.userServices.getUser(this.user.token));

          this.navCtrl.setRoot(ContactListPage).then();
        })
        .catch(error => {
          console.log(error)
        });
    } else {
      toastMessage = this.translateServices.instant('userProfileNotModified');
    }

      let toast = this.toastCtrl.create({
        message: toastMessage,
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }


  ionViewDidLoad() {
    this.storage.get('user').then(user=>{
      console.log(user.lastName);
      this.user=user;
      this.fillFields()
    })
      .catch(error=>console.log("erreur get user edit user"))
  }

  fillFields() {
    this.lastName = this.user.lastName;
    this.firstName = this.user.firstName;
    this.email = this.user.email;
    this.profile = this.user.profile;
  }

  goToContactList() {
    this.navCtrl.setRoot(ContactListPage, {}, {animate:true});
  }

}
