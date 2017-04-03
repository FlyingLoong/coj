import { Problem } from '../../models/problem.model';
import { Component, OnInit, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {

  subscriptionProblem: Subscription;

  problems: Problem[] = []

  searchTerm: string = '';
  subscriptionInput: Subscription;

  constructor(@Inject("data") private data, @Inject("input") private input) { }

  ngOnInit() {
    this.getProblems();
    this.getSearchTerm();
  }

  getProblems(): void {
    this.subscriptionProblem = this.data.getProblems().subscribe(problems => this.problems = problems);
  }

  getSearchTerm(): void{
    console.log("getSearchTerm is called");
    this.subscriptionInput = this.input.getInput().subscribe(term => {console.log(term); this.searchTerm = term});
  }

}
