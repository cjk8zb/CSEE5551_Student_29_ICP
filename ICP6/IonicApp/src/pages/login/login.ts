import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

import { TabsPage } from "../tabs/tabs";
import { RegisterPage } from "../register/register";
import {Credentials, User} from "../../models/user";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  credentials: Credentials = {
    username: "",
    password: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  submitLogin() {
    const users: [User] = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => {
      return user.username.toLowerCase() === this.credentials.username.toLowerCase()
        && user.password === this.credentials.password
    });

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.navCtrl.setRoot(TabsPage);
    } else {
      let alert = this.alertCtrl.create({
        title: 'Login Failed',
        subTitle: 'Invalid username or password. Please try again.',
        buttons: ['OK']
      });
      alert.present();
    }

  }

  showRegistration() {
    this.navCtrl.push(RegisterPage);
  }
}
