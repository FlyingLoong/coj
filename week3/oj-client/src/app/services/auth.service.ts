import { Http, Response, Headers } from '@angular/http';
import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  clientId = "zVVcYL3z0LzGj7X0n5Yzf9vxyetdzNRL";
  domain = "coj.au.auth0.com";
  lock = new Auth0Lock(this.clientId, this.domain, {});

  constructor(private http: Http) {
    // Add callback for lock 'authenticated' event
    //this.lock.on("authenticated", (authResult) => {
    //  localStorage.setItem("id_token", authResult.idToken);
    //});
  }

  public login(): Promise<Object> {
    return new Promise((resolve, reject) => {
      this.lock.show((error: string, profile: Object, id_token: string) => {
        if (error) {
          reject(error);
        } else {
          localStorage.setItem('profile', JSON.stringify(profile));
          localStorage.setItem('id_token', id_token);
          resolve(profile);
        }
      });
    })
    // Call the show method to display the widget
  }

  public authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  }

  public logout() {
    // Remove token from localStorage
    localStorage.removeItem("id_token");
    localStorage.removeItem("profile");
  }

  public getProfile(): Object {
    return JSON.parse(localStorage.getItem("profile"));
  }

  public resetPassword(): void {
    let profile = this.getProfile()
    let url: string = `https//${this.domain}/dbconnections/change_password`;
    let headers = new Headers({"content-type": "application/json"});
    let body = {
      client_id: this.clientId,
      email: profile.email,
      connection: "Username-Password-Authentication"
    };

    this.http.post(url, body, headers).toPromise()
      .then((res: Response) => console.log(res.json()))
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('Error occurred', error);
    return Promise.reject(error.message || error);
  }

}
