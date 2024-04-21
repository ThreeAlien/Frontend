import { Injectable } from '@angular/core';
import { LoginInfoModel } from '../login/login.models';

@Injectable({
  providedIn: 'root'
})
/// 目前用不到  後如果有機敏要用這個存起來
export class LoginInfoService {

  constructor() { }
  private _userInfo: LoginInfoModel = new LoginInfoModel;


  get userInfo(): LoginInfoModel {
    return this._userInfo;
  }

  set userInfo(userInfo: LoginInfoModel) {
    this._userInfo = userInfo;
  }
}
