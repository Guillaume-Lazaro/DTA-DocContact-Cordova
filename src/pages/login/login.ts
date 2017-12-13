import { Component } from '@angular/core';
import {Events, IonicPage, MenuController, NavController, ToastController} from 'ionic-angular';
import { InscriptionPage } from '../inscription/inscription';
import { ContactListPage } from '../contact-list/contact-list';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {UserServicesProvider} from "../../providers/user-services/user-services";
import {ContactServicesProvider} from "../../providers/contact-services/contact-services";
import { ApiServicesProvider } from "../../providers/api-services/api-services";
import {AlertController} from "ionic-angular";
import {User} from "../../model/User";
import {Storage} from "@ionic/storage";
import { TranslateService } from '@ngx-translate/core';
import {NetworkProvider} from "../../providers/network-services/network-services";

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


  constructor(fb: FormBuilder, private toastCtrl: ToastController, public navCtrl : NavController, public events: Events,
              public userServices : UserServicesProvider, public apiServices: ApiServicesProvider, private alertCtrl: AlertController,
              public menuCtrl: MenuController, private storage: Storage, private translateService: TranslateService,
              public networkSerices: NetworkProvider) {

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
      .then((response: any)=>{
        if(response.status === 400){
          let toast = this.toastCtrl.create({
            message: this.translateService.instant('loginOrPasswordInvalid'),
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        }
        if(response.token !== undefined){
          // On récupère le user correspondant et on le stocke en base locale avant de passer à la vue suivante
          this.userServices.getUser(response.token).then((user:User)=>{
            this.storage.set('user',user).then(()=>{
              this.goToContactList()
            })
              .catch(error=>console.log("erreur set user local" + error))
          })
            .catch(error=>console.log("erreur get user serveur" + error))
        }
      })
      .catch();
  }

  ionViewDidLoad() {
  }

  logConnection(){
    if (this.networkSerices.checkConnection()) {
      console.log('Online');
    }else{
      console.log('Offline');
    }
  }

  goToInscription(){
    this.navCtrl.push(InscriptionPage).then();
  }


  goToContactList(){
    this.navCtrl.setRoot(ContactListPage).then();

  }

  forgotPassword(){
    this.apiServices.getProfiles().toPromise()
    .then(data => {
      console.log(data);
    });
    let alert = this.alertCtrl.create({
      title: this.translateService.instant('forgottenPassword'),
      message: this.translateService.instant('pleaseEnterYourPhoneNumber'),
      inputs: [
        {
          name: "phone",
          placeholder: this.translateService.instant('phoneNumber')
        }
      ],
      buttons:[
        {
          text: this.translateService.instant('cancel'),
          role: "cancel",
          handler:() => {
            console.log('cancel ');
          }
        },
        {
          text: this.translateService.instant('sendPassword'),
          handler: data => {
            this.apiServices.forgotPassword(data.phone).toPromise()
              .then(()=> {
                let toast = this.toastCtrl.create({
                  message: this.translateService.instant('passwordSent'),
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present().then();
              })
              .catch(error => {
                console.log(error);
                let toast = this.toastCtrl.create({
                  message: this.translateService.instant('unknownPhone'),
                  duration: 3000,
                  position: 'bottom'
                });
                toast.present().then();
              })
          }
        }
      ]
    });
    alert.present();
  }

  goToAccueil(){
    this.navCtrl.push(ContactListPage).then();
  }

}
