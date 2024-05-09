import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientSSOService } from 'src/app/service/client-sso.service';
import { LoginInfoService } from 'src/app/service/login-info.service';
import { environment } from 'src/environments/environment';
import { MatIconModule } from '@angular/material/icon';

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
