import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClientSSOService } from '../share/service/client-sso.service';
import { catchError, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiService } from '../share/service/api.service';

@Component({
  selector: 'app-ssojump',
  templateUrl: './ssojump.component.html',
  styleUrls: ['./ssojump.component.css'],
  standalone: true
})
export class SSOJumpComponent implements OnInit {
  constructor(private clientSSO: ClientSSOService,
    private activateRoute: ActivatedRoute, private router: Router, private apiSvc: ApiService) {

  }
  stateString = "取得權限中，請稍後...";

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(async params => {
      const code = params['code'];
      const type = params['state'];
      switch (type) {
        /**登入用 */
        case "ssoLogin":
          this.stateString = "取得權限中，請稍後...";
          try {
            let refresh = await this.clientSSO.getReFreshToken(code);
            localStorage.removeItem('refresh');
            localStorage.setItem('refresh', refresh);
            if (refresh != "") {
              let PermissionsAds = await this.clientSSO.getPermissions(refresh);
              if (PermissionsAds) {
                this.clientSSO.setUserInfo(PermissionsAds, 1);
                this.router.navigate(["/home"]);
              } else {
                alert("取得授權失敗，檢查是否擁有權限");
                this.router.navigate(["/login"]);
              }
            } else {
              alert("取得Token失敗!!");
              this.router.navigate(["/login"]);
            }
          } catch (err) {
            alert("取得授權失敗，請聯絡工程師!");
            this.router.navigate(["/login"]);
          }
          break;
        /**資料更新用 */
        case "upData":
          this.stateString = "資料更新中，請稍後...";
          try {
            let refresh = await this.clientSSO.getReFreshToken(code);
            if (refresh != "") {
              const request = { RefreshToken: refresh };
              let rD = JSON.stringify(request);
              const path = environment.apiServiceHost + `api/InsertAdsData/InsertAllAdsData`;
              this.apiSvc.CallApi(path, "POST", rD).pipe(
                tap(res => {
                  {
                    if (res.code == "200") {
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
          } catch (err) {
            alert("取得授權失敗，請聯絡工程師!");
            this.router.navigate(["/login"]);
          }
          break;
        default:
          break;
      }
    });
  }

}
