import { Injectable } from '@angular/core';
import { PROBLEMS } from '../mock-problems';
import { Problem } from '../models/problem.model';

@Injectable()
export class ProblemService {

  constructor() { }

  getProblems(): Problem[] {
    return PROBLEMS;
  }

  getProblem(id: number): Problem {
    return PROBLEMS.find((problem) => problem.id === id);
  }

}
