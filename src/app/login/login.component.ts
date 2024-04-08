import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientSSOService } from '../service/client-sso.service';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { ApiService } from '../service/api.service';
import { BaseResponse } from '../share/Models/share.model';
import { HttpErrorResponse } from '@angular/common/http';
import { LoadingService } from '../service/loading.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private clientSSO: ClientSSOService,
    private router: Router,
    private formBuilder: FormBuilder,
    public apiService: ApiService,
    private msg: MessageService,
    public loadingService: LoadingService,
  ) { }
  account: string = "";
  password: string = "";


  async ngOnInit() {
    this.loadingService.loadingOff();
    this.form = this.formBuilder.group({
      acc: ['Admin', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]],
      pwd: ['', [Validators.required, Validators.pattern('^[A-Za-z0-9]+$')]]
    })
    let isLogin = this.clientSSO.isLoggedIn();
    if (isLogin) {
      this.router.navigate(["/home"]);
    }
  }
  /**帳號密碼認證 */
  async onLogin() {
    if (this.isCheck()) {
      let sta = await this.getLoginAuth();
      if(sta){
        this.oidcLogin();
        console.log(this.account);
      }
    }
  }
  /**取得ADS 權限認證 */
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

  isCheck(): boolean {
    if (!this.form.valid) {
      Object.keys(this.form.controls).forEach(col => {
        if (this.form.get(col)?.value == '' || this.form.get(col)?.value == null) {
          this.form.get(col)?.markAsTouched();
        }
      })
      return false;
    } else {
      this.account = this.form.get('acc')?.value;
      this.password = this.form.get('pwd')?.value
      return true;
    }
  }

  getLoginAuth() {
    this.loadingService.loadingOn();
    let acc = this.account;
    let pwd = this.password;
    try {
      const request = {
        account: acc,
        password: pwd
      };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/Auth/Login`;
      console.log(qryDataUrl);
      return new Promise<boolean>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            if(data.code == "200"){
              console.log(data.msg);
              resolve(true);
            }else{
              this.msg.add({ severity: 'error', summary: '錯誤', detail: '查無此帳號!' });
              this.loadingService.loadingOff();
              reject(false);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.msg.add({ severity: 'error', summary: '錯誤', detail: `登入失敗請聯絡工程師` });
            this.loadingService.loadingOff();
            reject(false)
          },
        });
      })
    }
    catch (e: any) {
      this.loadingService.loadingOff();
      return;
    }
  }


}
