import { Component } from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {NgForm} from "@angular/forms";
import {TabsPage} from "../tabs/tabs";
import {User} from "../../models/user";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user: User = {
    username: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: ""
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  submitRegistration(registrationForm: NgForm) {
    if (registrationForm.valid) {
      const users:[User] = JSON.parse(localStorage.getItem('users')) || [];
      users.push(this.user);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(this.user));
      this.navCtrl.setRoot(TabsPage);
    } else {
      console.log('registrationForm.errors', registrationForm.errors);
      for (let key in registrationForm.controls) {
        let control = registrationForm.controls[key];
        if (control.errors) {
          console.log('key', key, 'control', control, 'errors', control.errors);
        }
      }
    }
  }
}
