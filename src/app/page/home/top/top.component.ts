import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { ClientSSOService } from 'src/app/share/service/client-sso.service';
import { LoginInfoService } from 'src/app/share/service/login-info.service';

@Component({
    selector: 'app-top',
    templateUrl: './top.component.html',
    styleUrls: ['./top.component.css'],
    standalone: true,
    imports: [MatIconModule]
})
export class TopComponent implements OnInit {

  constructor(private clientSSO: ClientSSOService,
    private router: Router,
    private loginInfoSvc : LoginInfoService,) { }

  title = environment.production ? '' : '測試區';
  userName!: string;

  ngOnInit(): void {
    const name = this.loginInfoSvc.userInfo.userName;
    if (name) {
      this.userName = name
    }

  }
  onLogout() {
    this.clientSSO.logout();
    this.router.navigate(["/login"]);
  }

}
