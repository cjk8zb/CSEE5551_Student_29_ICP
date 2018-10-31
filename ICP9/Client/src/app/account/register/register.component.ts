import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../users.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  model = {
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    state: '',
    university: '',
    degree: '',
    major: ''
  };

  constructor(private users: UsersService) {
  }

  ngOnInit() {
  }

  submitUser() {

    this.users.createUser(
      this.model.username,
      this.model.password,
      this.model.firstName,
      this.model.lastName,
      this.model.email,
      this.model.city,
      this.model.state,
      this.model.university,
      this.model.degree,
      this.model.major).subscribe(res => {
      console.log(res);
    }, error => {
      console.error(error);
    });
  }
}
