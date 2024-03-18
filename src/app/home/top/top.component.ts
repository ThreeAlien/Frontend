import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientSSOService } from 'src/app/service/client-sso.service';
import { MsgBoxService } from 'src/app/service/msg-box.service';
import { MsgBoxBtnType, MsgBoxInfo } from 'src/app/share/msg-box/msg-box.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {

  constructor(private clientSSO : ClientSSOService,
    private router: Router,) { }

  title = environment.production ? '' : '測試區';
  loginName = "汎古";

  ngOnInit(): void {

  }
  onLogout(){
    this.clientSSO.logout();
    this.router.navigate(["/login"]);
  }

}
