import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { BaseResponse } from '../report-manage/report-manage.models';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

/**登入存一個TOKEN */
const TOKEN_KEY = '';
/**登入者廣告權限資料 */
const USER_ADSINFO = '';
/**有效期限 */
const EXPIRATION_KEY = "";

@Injectable({
  providedIn: 'root'
})

/**登入SSO認證 導入google */
export class ClientSSOService {

  constructor(public apiService: ApiService,private router:Router) { }
  public nowPageUrl: any;
  public nextPageUrl: any;
  refreshToken = "<REFRESH-TOKEN>";

  // 確認伺服器認證登入
  async checklogInfo(NowUrl: any, NextUrl: any): Promise<boolean> {
    console.log("確認伺服器認證登入");
    this.nowPageUrl = NowUrl;
    this.nextPageUrl = NextUrl;
    console.log(NowUrl);
    console.log(NextUrl);
    if (this.isLoggedIn()) {
      return true;
    } else {
      alert("登入失敗!無法取得資料")
      return false;
    }
  }
/**
 * 設定localStorage 資料,在登入時將用戶資訊和過期時間存儲到本地存儲
 * @param userInfo 廣告帳號權限
 * @param expirationMinutes  有效期限(天)
 */
  setUserInfo(userInfo: any, expirationMinutes: number): void {

    const currentTime = new Date().getTime();
    const expirationTime = currentTime + expirationMinutes * 24 * 60 * 60 * 1000;

    localStorage.setItem(TOKEN_KEY, "55688");
    localStorage.setItem(USER_ADSINFO, JSON.stringify(userInfo));

    localStorage.setItem(EXPIRATION_KEY, expirationTime.toString());
  }

  /**登出時清除  localStorage*/
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ADSINFO);
    localStorage.removeItem(EXPIRATION_KEY);
  }

  /**檢查是否有登入過 */
  isLoggedIn(): boolean {
    // 檢查本地存儲中是否有用戶資訊
    const token = localStorage.getItem(TOKEN_KEY);
    const userInfoString = localStorage.getItem(USER_ADSINFO);
    const expirationTime = localStorage.getItem(EXPIRATION_KEY);
    if (userInfoString && expirationTime && token) {
      const currentTime = new Date().getTime();
      // 檢查過期時間
      if (currentTime < +expirationTime) {
        return true;
      } else {
        // 清除過期的資訊
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_ADSINFO);
        localStorage.removeItem(EXPIRATION_KEY);
        alert("登入已超時，請重新登入!!");

        return false
      }
    }
    return false;
  }
//#region  API 相關
  /**登入 取登入者的帳號權限 可以看到有權限的廣告帳號 */
  getPermissions(refreshToken:any) {
    const path = "api/AdsData/GetAdsAccount";
    let req = {
      RefreshToken: refreshToken
    }
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.CallApi(path, 'POST', req).subscribe({
        next: (res) => {
          var data = res as BaseResponse;
          if (data.code == "200") {
            resolve(data.data);
          } else {
            resolve(false);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message);
          reject(false);
        },
      });
    })
  }
  /**取得 ReFreshToke */
  getReFreshToken(code:string) {
    const path = "api/Sso/AuthorizeCallBack";
    let req = {
      code: code
    }
    return new Promise<boolean>((resolve, reject) => {
      this.apiService.CallApi(path, 'POST', req).subscribe({
        next: (res) => {
          var data = res as BaseResponse;
          if (data.code == "200") {
            resolve(data.data);
          } else {
            resolve(false);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.message);
          reject(false);
        },
      });
    })
  }
//#endregion
}

