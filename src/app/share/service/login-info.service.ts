import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, skipWhile } from 'rxjs';
import { LoginInfoModel } from '../Models/share.model';


@Injectable({
  providedIn: 'root'
})
/// 目前用不到  後如果有機敏要用這個存起來
export class LoginInfoService {

  constructor() { }
  // newData!:LoginInfoModel; 目前跳頁的方式抓不到資料
  // userProfileSub: BehaviorSubject<LoginInfoModel> = new BehaviorSubject<LoginInfoModel>(this.newData);
  // userProfile$ : Observable<LoginInfoModel> = this.userProfileSub.asObservable();

  private _userInfo: LoginInfoModel = new LoginInfoModel;


  get userInfo(): LoginInfoModel {
    return this._userInfo;
  }

  set userInfo(userInfo: LoginInfoModel) {
    this._userInfo = userInfo;
  }
  /**
   * 訂閱(使用資料)
   * @returns
   */
  // userProfile(): Observable<LoginInfoModel> {
  //   return this.userProfile$.pipe(skipWhile((data) => !data));
  // }
}
