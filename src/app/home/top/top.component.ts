import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientSSOService } from 'src/app/service/client-sso.service';
import { LoginInfoService } from 'src/app/service/login-info.service';
import { MsgBoxService } from 'src/app/service/msg-box.service';
import { MsgBoxBtnType, MsgBoxInfo } from 'src/app/share/msg-box/msg-box.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {

  constructor(private clientSSO: ClientSSOService,
    private router: Router,
    private loginInfo: LoginInfoService) { }

  title = environment.production ? '' : '測試區';
  userName!: string;

  ngOnInit(): void {
    const name = this.loginInfo.userInfo.userName;
    if (name) {
      this.userName = name
    }

  }
  onLogout() {
    this.clientSSO.logout();
    this.router.navigate(["/login"]);
  }

}
