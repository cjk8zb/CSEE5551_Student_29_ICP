import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UsersService} from '../users.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private users: UsersService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if (this.users.isLoggedIn) { return true; }

    // Store the attempted URL for redirecting
    this.users.redirectUrl = state.url;

    // Navigate to the login page with extras
    this.router.navigate(['/account/login']);
    return false;
  }
}
