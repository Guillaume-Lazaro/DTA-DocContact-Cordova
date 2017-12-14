import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform, Events, ToastController } from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkProvider {
  private toast;
  private toast2;
  private toastVisible = false;
  private bool: Boolean;

  constructor(public http: HttpClient, private networkState: Network, public platform: Platform,
              public events: Events, public toastCtrl: ToastController, public translate: TranslateService) {
    console.log('Hello NetworkProvider Provider');
  }

  isConnect(): boolean {
    return this.networkState.type !== 'none';
  }

  checkConnection(){
    this.networkState.onConnect().subscribe(() =>{
      console.log('online network');
      if (this.toastVisible || this.bool == false) {
        this.toast.dismiss();
        this.initMessageConnect();
        this.showMessageConnect();
      }else{
        if(this.bool == true){
          this.initMessageConnect();
          this.showMessageConnect();
        }
      }
      this.events.publish('connected');
    },                                 (error) => {
      console.error(error);
    });

    this.networkState.onDisconnect().subscribe(() => {
      console.log('Offline Network');
      this.initMessage();
      this.showMessage();
      this.events.publish('disconnected');
    },                                    (error) => {
      console.error(error);
    }
    );
  }

  private initMessage() {
    let message = 'NETWORK_NONE_MESSAGE';
    let testOK = 'OK';
    this.translate.get(message).subscribe(
      (translation) => {
        message = translation;
      });

    this.toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: testOK,
    });
    this.toast.onDidDismiss(() => {
      this.toastVisible = false;
      this.bool = !this.isConnect();
    });
  }

  private initMessageConnect() {
    let message = 'NETWORK_MESSAGE';
    let testOK = 'OK';
    this.translate.get(message).subscribe(
      (translation) => {
        message = translation;
      });

    this.toast2 = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: testOK,
    });
    this.toast2.onDidDismiss(() => {
      this.toastVisible = false;
    });
  }

  showMessage() {
    this.toast.present();
    this.toastVisible = true;
  }

  showMessageConnect(){
    this.toast2.present();
    this.toastVisible = true;
  }

}
