import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiServicesProvider} from "../../providers/api-services/api-services";
import {TranslateService} from '@ngx-translate/core';
import {UserServicesProvider} from "../../providers/user-services/user-services";
import {Storage} from "@ionic/storage";
import {User} from "../../model/User";
import {ContactListPage} from "../contact-list/contact-list";

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

  lastName:   string="";
  firstName:  string="";
  phone:      string="";
  email:      string="";
  profile:    string="";
  password:   string="";
  confirmPassword: string="";
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
              public events: Events, public apiServices: ApiServicesProvider, private translateService: TranslateService,
              private userServices: UserServicesProvider, private storage: Storage) {

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

    this.passwordCtrl = fb.control('', [Validators.minLength(4), Validators.maxLength(4), Validators.required]);
    this.confirmPasswordCtrl = fb.control('', Validators.required);

    this.passwordForm = fb.group({
      password: this.passwordCtrl,
      confirmPassword: this.confirmPasswordCtrl
    }, {validator: this.passwordsMatch});
  }

  handleSubmit() {
    if (this.password == this.confirmPassword) {
      this.userServices.createUser(this.phone, this.password, this.firstName, this.lastName, this.email, this.profile)
        .then((userJson: any) => {
          this.userServices.logTheUser(userJson.phone, this.password).then((message:any)=>{
            this.storage.get('user').then((user:User)=>{
              user.token = message.token;
              this.storage.set('user',user).then(()=>{
                this.navCtrl.setRoot(ContactListPage).then()
                  .catch(error=>console.log(error.error));
              })
                .catch(error=>console.log(error.error));
            })
              .catch(error=>console.log(error.error));
          })
            .catch(error=>console.log(error.error));
        })
        .catch(error=>console.log(error.error));

      //Toast pour prevenir
      let toast = this.toastCtrl.create({
        message: this.translateService.instant('signUpSuccessful'),
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    } else {
      let toast = this.toastCtrl.create({
        message: this.translateService.instant('incorrectConfirmPassword'),
        duration: 3000,
        position: 'bottom'
      });
      toast.present();
    }
  }

  ionViewDidLoad() { }

  passwordsMatch(control: AbstractControl) {
    let basePassword = control.get('password');
    let confirmPassword = control.get('confirmPassword');

    if (!basePassword || !confirmPassword) return null;

    if (basePassword.value === confirmPassword.value) {
      return null;
    } else {
      return {
        confirmError: {
          errorMessage: "Incorrect confirm password"
        }
      }
    }
  }
}
