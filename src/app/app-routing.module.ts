import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginRoutingGuardService } from './login-routing-guard.service';
import { LoginComponent } from './login/login.component';
import { ReportManageComponent } from './report-manage/report-manage.component';
import { ClientSSOService } from './service/client-sso.service';

const routes: Routes = [
  { path: "login", component: LoginComponent, data: { title: "登入" } },
  {
    path: "home",
    component: HomeComponent,
    data: {
      title: "主頁"
    },
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full"
      },
      {
        path: "reportManage",
        component: ReportManageComponent,
        canActivate: [LoginRoutingGuardService],
        data: {
          title: "範本管理"
        }
      },
    ]
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
