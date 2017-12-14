import { HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AlertController, Events, ToastController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";
import {User} from "../../model/User";
import {ApiServicesProvider} from "../api-services/api-services";
import {LoginPage} from "../../pages/login/login";

/*
  Generated class for the ErrorServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ErrorServicesProvider {

  constructor(public http: HttpClient, public alertCtrl: AlertController, public translateService: TranslateService,
              private storage: Storage, public apiServices:ApiServicesProvider, public toastCtrl: ToastController, public events:Events ) {

    console.log('Hello ErrorServicesProvider Provider');
  }

  invalidToken() {
    let alert = this.alertCtrl.create({
      title: this.translateService.instant('sessionExpiredTitle'),
      message: this.translateService.instant('sessionExpired'),
      buttons: [
        {
          text: this.translateService.instant('yes'),
          handler: () => {
            this.logAlert()
          }
        },
        {
          text: this.translateService.instant('no'),
          handler: () => {
            this.events.publish('no login')
          }
        }
      ]
    });
    alert.present().then();
  }

  logAlert(){
    this.storage.get('user').then((user:User)=>{
      console.log(user.phone)
      let alert = this.alertCtrl.create({
        title: this.translateService.instant('forgottenPassword'),
        message: this.translateService.instant('pleaseEnterYourPhoneNumber'),
        inputs: [
          {
            name: "password",
            type: "password",
            placeholder: this.translateService.instant('password'),
          }
        ],
        buttons:[
          {
            text: this.translateService.instant('cancel'),
            role: "cancel",
            handler:() => {
              this.events.publish('no login');
              console.log('cancel ');
            }
          },
          {
            text: this.translateService.instant('sendPassword'),
            handler: data => {
              this.apiServices.logUser(user.phone,data.password).toPromise()
                .then((reponse:any)=> {
                  if(reponse.token!== undefined){
                    user.token = reponse.token;
                    this.storage.set('user',user).then();
                    let toastValid = this.toastCtrl.create({
                      message: this.translateService.instant('passwordSent'),
                      duration: 3000,
                      position: 'bottom'
                    });
                    toastValid.present().then();
                  }
                })
                .catch(error => {
                  if(error.status = 400){
                    let toastInvalid = this.toastCtrl.create({
                      message: this.translateService.instant('PasswordInvalid'),
                      duration: 3000,
                      position: 'bottom'
                    });
                    toastInvalid.present().then(()=>{
                      this.logAlert()
                    });
                  }
                })
            }
          }
        ]
      });
      alert.present().then();
    })

  }
}
