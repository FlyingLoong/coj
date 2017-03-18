import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  title: String;

  username: String;

  constructor() { }

  ngOnInit() {
    this.title = "Collaborative Online Judge";
    this.username = "Yidong";
  }

}
