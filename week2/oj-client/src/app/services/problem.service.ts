import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { PROBLEMS } from '../mock-problems';
import { Problem } from '../models/problem.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProblemService {

  private problemSource = new BehaviorSubject<Problem[]>([]);

  constructor(private http: Http) { }

  getProblems(): Observable<Problem[]> {
    this.http.get("api/v1/problems").toPromise()
      .then((res: Response) => {this.problemSource.next(res.json())})
      .catch(this.handleError)

      return this.problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    console.log(id);
    return this.http.get(`api/v1/problems/${id}`).toPromise()
      .then((res: Response) => res.json())
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error("An error occurred!", error);
    return Promise.reject(error.body || error);
  }

}
