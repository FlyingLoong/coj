import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import "rxjs/add/operator/debounceTime";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username: string = "";

  searchBox: FormControl = new FormControl();
  subscription: Subscription;

  constructor(@Inject("auth") private auth, @Inject("input") private input, private router: Router) { }

  ngOnInit() {
    if (this.auth.authenticated()) {
      this.username = this.auth.getProfile().nickname;
    }

    this.subscription = this.searchBox.valueChanges.debounceTime(200).subscribe(term => this.input.changeInput(term.toLowerCase()));
  }

  ngOnDestroy() {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }

  searchProblem(): void {
    console.log("searchProblem is called!");
    this.router.navigate(["/problems"]);
  }

  login(): void {
    this.auth.login()
      .then(profile => this.username = profile.nickname)
      .catch (error => console.log(error))
    //this.username = this.auth.getProfile().nickname;
  }

  logout(): void{
    this.auth.logout();
  }

}
