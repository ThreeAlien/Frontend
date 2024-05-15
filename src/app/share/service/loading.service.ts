import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor() { }
  private _isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  get isLoading$(): Observable<boolean> {
    return this._isLoading$.asObservable();
  }
  loadingOn() {
    this._isLoading$.next(true);
  }

  loadingOff() {
    this._isLoading$.next(false);
  }
}
