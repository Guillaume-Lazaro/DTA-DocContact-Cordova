import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {AlertController, ToastController} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";
import {Storage} from "@ionic/storage";
import {User} from "../../model/User";
import {UserServicesProvider} from "../user-services/user-services";

/*
  Generated class for the ErrorServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ErrorServicesProvider {

  constructor(public http: HttpClient, public alertCtrl: AlertController, public translateService: TranslateService,
              private storage: Storage, public userServices:UserServicesProvider, public toastCtrl: ToastController) {
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
          // TODO AlertLogin
        }
      },
      {
        text: this.translateService.instant('no'),
        handler: () => {
        }
      }
    ]
  })
  alert.present()
}

logAlert(){
    this.storage.get('user').then((user:User)=>{
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
              console.log('cancel ');
            }
          },
          {
            // TODO : Modifier messages
            text: this.translateService.instant('sendPassword'),
            handler: data => {
              this.userServices.logTheUser(user.phone,data.password)
                .then((reponse:any)=> {
                  if(reponse.token!== undefined){
                    user.token = reponse.token;
                    this.storage.set('user',user);
                    let toast = this.toastCtrl.create({
                      message: this.translateService.instant('passwordSent'),
                      duration: 3000,
                      position: 'bottom'
                    });
                    toast.present().then();
                  } else {
                    let toast = this.toastCtrl.create({
                      message: this.translateService.instant('loginOrPasswordInvalid'),
                      duration: 3000,
                      position: 'bottom'
                    });
                    toast.present();
                    this.logAlert()
                  }
                  user.token = reponse.token;
                  this.storage.set('user',user)
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
    })

}
}
