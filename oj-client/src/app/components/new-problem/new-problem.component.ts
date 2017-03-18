import { Component, OnInit, Inject } from '@angular/core';
import { Problem } from '../../models/problem.model';

const DEFAULT_PROBLEM: Problem = Object.freeze({
  id: 0,
  name: "",
  desc: "",
  difficulty: ""
})

const DIFFICULITIES: String[] = ["Easy", "Medium", "Hard", "Super"];

@Component({
  selector: 'app-new-problem',
  templateUrl: './new-problem.component.html',
  styleUrls: ['./new-problem.component.css']
})
export class NewProblemComponent implements OnInit {

  newProblem: Problem = Object.assign({}, DEFAULT_PROBLEM);
  difficulties: String[] = DIFFICULITIES;

  constructor(@Inject("data") private data) { }

  ngOnInit() {
  }

  addProblem(): void{
    this.data.addProblem(this.newProblem)
      .catch(error => console.log(error.body));
    this.newProblem = Object.assign({}, DEFAULT_PROBLEM);
  }

}
