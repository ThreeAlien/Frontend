import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
/**登入SSO認證 導入google */
export class ClientSSOService {

  constructor() { }
  public nowPageUrl: any;
  public nextPageUrl: any;

  refreshToken = "<REFRESH-TOKEN>";

  // 確認伺服器認證登入
  async checklogInfo(NowUrl: any, NextUrl: any): Promise<boolean> {
    console.log("確認伺服器認證登入");
    this.nowPageUrl = NowUrl;
    this.nextPageUrl = NextUrl;
    console.log(NowUrl + "," + NextUrl);

    return true;
  }

  async onLogin(): Promise<string> {
    console.log("成功登入!!");
    var sta = "1";
    return sta;
  }
}
