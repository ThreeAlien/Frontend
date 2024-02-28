import { Component, OnInit } from '@angular/core';
import { ClientSSOService } from '../service/client-sso.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ssojump',
  templateUrl: './ssojump.component.html',
  styleUrls: ['./ssojump.component.css']
})
export class SSOJumpComponent implements OnInit{
  constructor( private clientSSO: ClientSSOService,
    private activateRoute: ActivatedRoute,private router: Router){

  }

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(async params => {
      const code = params['code'];

      let refresh = await this.clientSSO.getReFreshToken(code);

      if(refresh){
        let PermissionsAds = await this.clientSSO.getPermissions(refresh);

        if(PermissionsAds){
          this.clientSSO.setUserInfo(PermissionsAds,1);
          this.router.navigate(["/home"]);
        }
        console.log(PermissionsAds);
      }
      // 獲取的值
      console.log('Code:', code);
    });
  }

}
