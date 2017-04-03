import { CanActivate, Router } from '@angular/router';
import { Injectable, Inject } from '@angular/core';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(@Inject("auth") private auth, private router: Router) { }

  canActivate() : boolean {
    if (this.auth.authenticated()) {
      return true;
    } else {
      this.router.navigate(['/problems']);
      return false;
    }
  }

  isAdmin(): boolean {
    if (this.auth.authenticated() && this.auth.getProfile().roles.includes("Admin")) {
      return true;
    } else {
      return false;
    }
  }

}
