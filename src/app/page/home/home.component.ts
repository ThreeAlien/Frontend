import { Component, OnInit } from '@angular/core';
import { MatDrawerToggleResult, MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { TopComponent } from './top/top.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsideComponent } from './aside/aside.component';
import { CommonService } from 'src/app/share/service/common.service';
import { LoginInfoService } from 'src/app/share/service/login-info.service';
import { tap } from 'rxjs';
import { LoadingComponent } from "../../share/loading/loading.component";


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: true,
    imports: [MatSidenavModule, AsideComponent, MatButtonModule, MatIconModule, TopComponent, RouterOutlet, LoadingComponent]
})
export class HomeComponent implements OnInit {

  constructor(private CommonSvc:CommonService,private loginInfoSvc : LoginInfoService) { }

  async ngOnInit(): Promise<void> {
    // await this.CommonSvc.getClinetName();
    const id = localStorage.getItem('id');
    const name = localStorage.getItem('name');
    const lv = localStorage.getItem('lv');
    if(id){
      this.loginInfoSvc.userInfo.userId = id;
    }
    if(name){
      this.loginInfoSvc.userInfo.userName = name;
    }
    if(lv){
      this.loginInfoSvc.userInfo.userLv = lv;
    }
  }

  toggleSideNav(sideNav: MatSidenav) {
    sideNav.toggle().then((result: MatDrawerToggleResult) => {
      console.log(`選單狀態：${result}`);
    });
  }
}
