import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './user';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  redirectUrl: string;

  constructor(private http: HttpClient, private router: Router) {
  }

  public get isLoggedIn() {
    return this.currentUser != null;
  }

  private get currentUser(): User {
    const user = localStorage.getItem('currentUser');
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  private set currentUser(user) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.router.navigate(['/']);
    } else {
      localStorage.removeItem('currentUser');
      this.router.navigate(['/account/login']);
    }
  }

  public login(username, password) {
    return this.http.post<User>('http://localhost:8081/login', {
      username,
      password
    }).pipe(map(user => {
      this.currentUser = user;
      return user;
    }));
  }

  public createUser(username, password, firstName, lastName, email, city, state, university, degree, major) {
    return this.http.post<User>('http://localhost:8081/register', {
      username,
      password,
      firstName,
      lastName,
      address: {
        city,
        state
      },
      education: {
        university,
        degree,
        major
      },
      email
    }).pipe(map(user => {
      return this.login(user.username, user.password);
    }));
  }

  public find(name, university) {
    return this.http.get<User[]>('http://localhost:8081/search', {
      params: {
        name,
        university
      }
    });
  }

  public logout() {
    this.currentUser = null;
  }
}
