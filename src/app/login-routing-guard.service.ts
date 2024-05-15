import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ClientSSOService } from './share/service/client-sso.service';


@Injectable({
  providedIn: 'root'
})
export class LoginRoutingGuardService {

  constructor(private router: Router, private clientSSO: ClientSSOService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree>> {
    console.log("轉頁檢核");
    let isRouting = this.clientSSO.checklogInfo(this.router.url, route.routeConfig?.path);
    if (await isRouting) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }

}
