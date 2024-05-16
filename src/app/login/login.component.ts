import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { BaseResponse } from '../share/Models/share.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { RegisterComponent } from './register/register.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingComponent } from '../share/loading/loading.component';
import { ToastModule } from 'primeng/toast';
import { ApiService } from '../share/service/api.service';
import { ClientSSOService } from '../share/service/client-sso.service';
import { LoadingService } from '../share/service/loading.service';
import { LoginInfoService } from '../share/service/login-info.service';
import { tap } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [MessageService],
    standalone: true,
    imports: [ToastModule, LoadingComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterOutlet]
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  constructor(
    private clientSSO: ClientSSOService,
    private router: Router,
    private formBuilder: FormBuilder,
    public apiService: ApiService,
    private msgSvc: MessageService,
    public loadingService: LoadingService,
    private LoginInfoSvc :LoginInfoService,
    public dialog: MatDialog,
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
      if (sta) {
        this.oidcLogin();
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
  /**註冊按鈕 */
  onRegisterClick() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: "360px",
      height: "auto",
      data: "",
      hasBackdrop: true,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(async result => {
      if(result.data){
        this.msgSvc.add({ severity: 'success', summary: '成功', detail: '註冊成功，請重新登入!!' })
      }
    });
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
      return new Promise<boolean>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            if (data.code == "200") {
              localStorage.setItem('id', data.data.userId);
              localStorage.setItem('name', data.data.userName);
              resolve(true);
            } else {
              this.msgSvc.add({ severity: 'error', summary: '錯誤', detail: '查無此帳號!' });
              this.loadingService.loadingOff();
              reject(false);
            }
          },
          error: (error: HttpErrorResponse) => {
            this.msgSvc.add({ severity: 'error', summary: '錯誤', detail: `登入失敗請聯絡工程師` });
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
