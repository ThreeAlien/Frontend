import { DatePipe, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadingService } from 'src/app/service/loading.service';
import { registerRequest } from './register.model';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseResponse } from 'src/app/share/Models/share.model';
import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/service/api.service';
import { catchError, map } from 'rxjs';
import { MessageService } from 'primeng/api';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoadingComponent } from '../../share/loading/loading.component';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: true,
    imports: [ToastModule, LoadingComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, MatIconModule, MatButtonModule]
})
export class RegisterComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public inPutdata: any,
    public datePipe: DatePipe, public loadingSvc: LoadingService, public apiSvc: ApiService, private msgSvc: MessageService) {
    this.loadingSvc.loadingOff();
  }

  myForm!: FormGroup;
  isShowPws: boolean = false;
  isShowChkPws: boolean = false;
  isChkErr: boolean = false;
  // 排除特殊字元
  // password: new FormControl('', [Validators.pattern("^(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z]{6,20}"), Validators.required]),
  ngOnInit(): void {
    this.myForm = new FormGroup({
      userId: new FormControl('', [Validators.pattern("^[0-9A-Za-z]+$"), Validators.required]),
      userName: new FormControl('', [Validators.minLength(2), Validators.maxLength(10), Validators.required]),
      account: new FormControl('', [Validators.pattern("^(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z]{6,12}"), Validators.required]),
      password: new FormControl('', [Validators.pattern("^(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z]{6,20}"), Validators.required]),
      chkPsw: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  /**二次確認密碼 */
  doubleChk(): boolean {
    const chk = this.myForm.controls['chkPsw'].value;
    const psw = this.myForm.controls['password'].value;
    if (!chk || !psw) {
      return true;
    }
    return chk == psw ? false : true;
  }
  /**檢查Reqest */
  checkReq() {
    if (!this.myForm.valid) {
      this.msgSvc.add({ severity: 'warn', summary: '警告', detail: `資料未填寫正確!!` });
      Object.keys(this.myForm.controls).forEach(col => {
        if (this.myForm.get(col)?.value == '' || this.myForm.get(col)?.value == null) {
          this.myForm.get(col)?.markAsTouched();

        }
      })
      return false;
    } else {
      let req: registerRequest = {
        account: this.myForm.get('account')?.value,
        password: this.myForm.get('password')?.value,
        UserId: this.myForm.get('userId')?.value,
        UserCname: this.myForm.get('userName')?.value,
        Email: this.myForm.get('email')?.value
      }
      this.addAccount(req);
      return true;
    }
  }
  /**是否顯示密碼 */
  isShowPwsClick(type: string) {
    switch (type) {
      case "p":
        this.isShowPws = !this.isShowPws;
        break;
      case "ckp":
        this.isShowChkPws = !this.isShowChkPws;
        break;
      default:
        break;
    }
  }
  onOk(): void {
    this.dialogRef.close({ data: false });
  }
  onSaveCLick() {
    const sta = this.doubleChk();
    if (sta !== null) {
      this.isChkErr = sta;
      if (this.isChkErr) {
        this.myForm.get('chkPsw')?.setValue('', Validators.required)
      }
    }
    this.checkReq();
  }
  onCancel(): void {
    this.dialogRef.close({ data: false });
  }
  /**註冊帳號API */
  addAccount(req: registerRequest) {
    this.loadingSvc.loadingOn();
    let rD = JSON.stringify(req);
    const path = environment.apiServiceHost + `api/Auth/CreateAccount`;
    this.apiSvc.CallApi(path, "POST", rD).pipe(
      map((res: BaseResponse) => {
        if (res.code !== "200") {
          this.msgSvc.add({ severity: 'error', summary: '失敗', detail: `註冊失敗，${res.msg}!!` });
          this.loadingSvc.loadingOff();
          return;
        }
        this.loadingSvc.loadingOff();
        this.dialogRef.close({ data: true });
      }),
      catchError(async (err) => {
        this.msgSvc.add({ severity: 'error', summary: '失敗', detail: '註冊失敗!!' })
        this.loadingSvc.loadingOff();
      })
    ).subscribe();
  }
}
