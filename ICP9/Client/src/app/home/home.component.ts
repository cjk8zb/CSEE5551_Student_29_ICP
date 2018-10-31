import { Component, OnInit } from '@angular/core';
import {UsersService} from '../users.service';
import {User} from '../user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  model = {
    name: '',
    university: ''
  };

  results: User[];

  constructor(private users: UsersService) { }

  ngOnInit() {
  }


  searchUsers() {
    this.users.find(this.model.name, this.model.university).subscribe(res => {
      console.log(res);
      this.results = res;
    }, error => {
      console.error(error);
    });
  }
}
