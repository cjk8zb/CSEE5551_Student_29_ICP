import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../users.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  model = {
    username: '',
    password: ''
  };

  constructor(private users: UsersService) {
  }

  ngOnInit() {
  }

  submitLogin() {
    this.users.login(this.model.username, this.model.password).subscribe(res => {
      console.log(res);
    }, error => {
      console.error(error);
    });
  }
}
