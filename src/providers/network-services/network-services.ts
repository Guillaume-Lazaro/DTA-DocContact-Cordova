import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Platform, Events, ToastController } from "ionic-angular";

/*
  Generated class for the NetworkProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NetworkProvider {
  private toast;
  private toastVisible = false;

  constructor(public http: HttpClient, private networkState: Network, public platform: Platform,
              public events: Events, public toastCtrl: ToastController) {
    console.log('Hello NetworkProvider Provider');
  }

  checkConnection(): boolean {
    return this.networkState.type !== 'none';
  }

  test(){
    this.networkState.onConnect().subscribe((data) =>{
      console.log('Connecté');
      if (this.toastVisible) {
        this.toast.dismiss();
      }
      this.events.publish('connected');
    },                                 (error) => {
      console.error(error);
    });

    this.networkState.onDisconnect().subscribe((data) => {
      console.log('Offline');
      this.initMessage();
      this.showMessage();
      this.events.publish('disconnected');
    },                                    (error) => {
      console.error(error);
    });
  }

  private initMessage() {
    let message = 'NETWORK_NONE_MESSAGE';
    let testOK = 'OK_LABEL';

    this.toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: testOK,
    });
    this.toast.onDidDismiss(() => {
      this.toastVisible = false;
    });
  }

  showMessage() {
    this.toast.present();
    this.toastVisible = true;
  }

}
