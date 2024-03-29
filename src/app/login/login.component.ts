import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientSSOService } from '../service/client-sso.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  constructor(
    private clientSSO: ClientSSOService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }
  account: string = "";
  password: string = "";
  form = this.formBuilder.group({
    account: ['', Validators.required],
    password: ['', Validators.required]
  })
  async ngOnInit() {
    let isLogin = this.clientSSO.isLoggedIn();
    if(isLogin){
      this.router.navigate(["/home"]);
    }
  }
  async onLogin(): Promise<void> {
    let longinSta = this.clientSSO.getPermissions("123");
    if (await longinSta) {
      console.log("按下登入回傳一")
      this.router.navigate(["/home"]);
    } else {
      alert("登入認證失敗!!")
    }
  }
  oidcLogin() {
    try {
      const client: google.accounts.oauth2.CodeClient = google.accounts.oauth2.initCodeClient({
        client_id: environment.clientId,
        scope: 'https://www.googleapis.com/auth/adwords',
        ux_mode: 'redirect',
        redirect_uri: environment.redirect_uri,
        state: 'ssoLogin',
      });
      console.log(client);
      client.requestCode();
    } catch (error) {
      console.log(error)
    }
  }
}
