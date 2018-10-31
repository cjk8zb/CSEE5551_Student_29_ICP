import { Component } from '@angular/core';
import {UsersService} from './users.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private users: UsersService, private router: Router) {}
  get isLoggedIn() {
    return this.users.isLoggedIn;
  }

  logout() {
    this.users.logout();
  }
}
