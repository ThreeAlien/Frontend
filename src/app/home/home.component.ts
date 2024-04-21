import { LoginInfoService } from './../service/login-info.service';
import { Component, OnInit } from '@angular/core';
import { MatDrawerToggleResult, MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';
import { ClientSSOService } from '../service/client-sso.service';
import { Observable } from 'rxjs';
import { LoginInfoModel } from '../login/login.models';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private loginInfoService : LoginInfoService) { }

  ngOnInit(): void {
    const id = localStorage.getItem('id');
    const name = localStorage.getItem('name');
    if(id){
      this.loginInfoService.userInfo.userId = id;
    }
    if(name){
      this.loginInfoService.userInfo.userName = name
    }



  }

  toggleSideNav(sideNav: MatSidenav) {
    sideNav.toggle().then((result: MatDrawerToggleResult) => {
      console.log(result);
      console.log(`選單狀態：${result}`);
    });
  }
}
