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

  constructor(@Inject("data") private data) { }

  ngOnInit() {
    this.getProblems();
  }

  getProblems(): void {
    this.subscriptionProblem = this.data.getProblems().subscribe(problems => this.problems = problems);
  }

}
