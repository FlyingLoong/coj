import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class InputService {
  private inputSubject$ = new BehaviorSubject<string>("");

  constructor() { }

  changeInput(term): void {
    this.inputSubject$.next(term);
  }

  getInput(): Observable<string> {
    return this.inputSubject$.asObservable();
  }

}
