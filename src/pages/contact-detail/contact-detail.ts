import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EditContactPage} from "../edit-contact/edit-contact";
import {CallNumber} from "@ionic-native/call-number";
import {EmailComposer} from "@ionic-native/email-composer";
import {SMS} from "@ionic-native/sms";
import { TranslateService } from '@ngx-translate/core';


@IonicPage()
@Component({
  selector: 'page-contact-detail',
  templateUrl: 'contact-detail.html',
})
export class ContactDetailPage {

  contact: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private callNumber: CallNumber,
              private emailComposer: EmailComposer, private sms:SMS) {
    this.contact = navParams.get('contact');
  }

  ionViewDidLoad() {

  }

  sendMessage(){
    console.log("passage dans sendMessage");
    let phoneNum = this.contact.phone;
    let message = "Doc contact c'est top";
    console.log("on envoie le message : '"+message+"' à : "+phoneNum);
    let options={
      replaceLineBreaks: false,
      android: {
        intent: 'INTENT'
      }
    };
    this.sms.send(phoneNum, message, options).then(e => console.log("success"+e)).catch(e => console.log('probleme de sms '));
  }

  giveCall(){
    this.callNumber.callNumber(this.contact.phone, true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
  }

  sendMail(){
    console.log("passage dans sendMail");
    let email = {
      to: this.contact.email,
      subject: 'Cher ami',
      body: 'Mail envoyé depuis mon app DocContact',
      isHtml: true
    };
    this.emailComposer.open(email);
  }

  goToEditView(contact){
    this.navCtrl.push(EditContactPage, { 'contact': this.contact }).then();
  }

}
