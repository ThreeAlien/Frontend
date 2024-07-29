import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
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
  constructor(private clientSSoSvc: ClientSSOService, private msgBox: MsgBoxService,private loadSvc:LoadingService,private loginInfo:LoginInfoService) {
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
            this.clientSSoSvc.oidcLogin("upData");
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
