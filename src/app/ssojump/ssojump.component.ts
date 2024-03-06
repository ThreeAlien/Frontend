import { Component, OnInit } from '@angular/core';
import { ClientSSOService } from '../service/client-sso.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ssojump',
  templateUrl: './ssojump.component.html',
  styleUrls: ['./ssojump.component.css']
})
export class SSOJumpComponent implements OnInit {
  constructor(private clientSSO: ClientSSOService,
    private activateRoute: ActivatedRoute, private router: Router) {

  }
  show() {

  }
  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(async params => {
      const code = params['code'];
      try {
        let refresh = await this.clientSSO.getReFreshToken(code);

        if (refresh) {
          let PermissionsAds = await this.clientSSO.getPermissions(refresh);
          console.log(PermissionsAds);
          if (PermissionsAds) {
            this.clientSSO.setUserInfo(PermissionsAds, 1);
            this.router.navigate(["/home"]);
          } else {
            alert("取得授權失敗，檢查是否擁有權限");
            this.router.navigate(["/login"]);
          }
        } else {
          alert("取得Token失敗，檢查是否擁有權限");
          this.router.navigate(["/login"]);
        }
      } catch (err) {
        console.log(err);
        this.router.navigate(["/login"]);
      }
    });
  }

}
