import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientSSOService } from './service/client-sso.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRoutingGuardService{

  constructor(private router: Router,private clientSSO : ClientSSOService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    console.log("轉頁檢核");
    return this.clientSSO.checklogInfo(this.router.url,route.routeConfig?.path);
  }
}
