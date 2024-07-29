import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ApiService } from 'src/app/share/service/api.service';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs';
import { MsgBoxService } from 'src/app/share/service/msg-box.service';
import { MsgBoxBtnType, MsgBoxInfo } from 'src/app/share/msg-box/msg-box.component';
import { LoadingService } from 'src/app/share/service/loading.service';
import { ClientSSOService } from 'src/app/share/service/client-sso.service';
import { LoginInfoService } from 'src/app/share/service/login-info.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatButtonModule,
    RouterLink,
  ],
})
export class AsideComponent implements OnInit {
  msgData: MsgBoxInfo = new MsgBoxInfo;
  userLv:string ="";
  constructor(private apiSvc:ApiService, private msgBox: MsgBoxService,private loadSvc:LoadingService,private loginInfo:LoginInfoService, private router: Router) {
    this.loadSvc.loadingOff();
   }
  ngOnInit(): void {
    this.userLv = this.loginInfo.userInfo.userLv;
  }
  udDateData() {
    this.msgData = new MsgBoxInfo;
    this.msgData.title = "警告";
    this.msgData.msg = `確定要更新 Google Ads 資料 ?`
    this.msgData.btnType = MsgBoxBtnType.ok_cancel;
    const chkMsgResult = this.msgBox.msgBoxShow(this.msgData);
    chkMsgResult.then(async x => {
      console.log(x);
      if (x?.result == "ok") {
        this.msgData = new MsgBoxInfo;
        this.msgData.title = "提醒";
        this.msgData.msg = `由於資料龐大，更新期間請勿關閉視窗，可以另開分頁進行其他作業!`
        this.msgData.btnType = MsgBoxBtnType.ok_cancel;
        const msgResult = this.msgBox.msgBoxShow(this.msgData);
        msgResult.then(async x => {
          if (x?.result == "ok") {
            //this.clientSSoSvc.oidcLogin("upData");
            let refresh = localStorage.getItem('refresh');
            if (refresh != "") {
              const request = { RefreshToken: refresh };
              let rD = JSON.stringify(request);
              const path = environment.apiServiceHost + `api/InsertAdsData/InsertAllAdsData`;
              this.apiSvc.CallApi(path, "POST", rD).pipe(
                tap(res => {
                  {
                    if (res.code == "200") {
                      alert("更新資料成功!");
                      this.router.navigate(["/home"]);
                    } else {
                      alert("更新資料失敗，請聯絡工程師");
                      this.router.navigate(["/home"]);
                    }
                  }
                }),
                catchError(async (err) => {
                  console.log(err);
                  alert("更新資料失敗，請聯絡工程師");
                  this.router.navigate(["/home"]);
                })
              ).subscribe();
            } else {
              alert("取得Token失敗!!");
              this.router.navigate(["/login"]);
            }
          } else {
            return;
          }
        })
      } else {
        return;
      }

    })

  }
}
