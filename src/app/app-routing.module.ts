import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginRoutingGuardService } from './login-routing-guard.service';
import { SSOJumpComponent } from './ssojump/ssojump.component';
import { ReportManageComponent } from './page/report-manage/report-manage.component';
import { BillManageComponent } from './page/bill-manage/bill-manage.component';

const routes: Routes = [
  {
    path: "login",
    loadComponent: () =>
      import('./login/login.component').then((mod) => mod.LoginComponent),
    data: { title: "登入" }
  },
  {
    path: "home",
    loadComponent: () =>
      import('./page/home/home.component').then((mod) => mod.HomeComponent),
    data: {title: "主頁"},
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },
      {
        path: "reportManage",
        loadComponent: () =>
          import('./page/report-manage/report-manage.component').then((mod) => mod.ReportManageComponent),
        canActivate: [LoginRoutingGuardService],
        data: {
          title: "範本管理"
        }
      },
      {
        path: "clientManage",
        loadComponent: () =>
          import('./page/bill-manage/bill-manage.component').then((mod) => mod.BillManageComponent),
        canActivate: [LoginRoutingGuardService],
        data: {
          title: "客戶管理"
        }
      },
    ]
  },
  {
    path: "sso",
    component: SSOJumpComponent,
    data: { title: "SSO" }
  },
  // 當路徑是空的時候轉址到 login
  {
    path: "**",
    redirectTo: "login",
    pathMatch: "full"
  },
  /**萬用路徑，路由沒有比對到，永遠會執行*/
  //{ path: "**", component: HomeComponent,},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
