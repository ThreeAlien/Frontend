import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<RegisterComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public inPutdata: any,
    public datePipe: DatePipe,) { }

  myForm!: FormGroup;
  isShowPws: boolean = false;
  isShowChkPws: boolean = false;
  isChkErr:boolean = false;
  // 排除特殊字元
  // password: new FormControl('', [Validators.pattern("^(?=.*[0-9])(?=.*[A-Za-z])[0-9A-Za-z]{6,20}"), Validators.required]),
  ngOnInit(): void {
    this.myForm = new FormGroup({
      userId: new FormControl('', [Validators.pattern("^[0-9A-Za-z]+$"), Validators.required]),
      userName: new FormControl('', [Validators.minLength(2),Validators.maxLength(10), Validators.required]),
      account: new FormControl('', [Validators.pattern("^[0-9A-Za-z]+$"), Validators.required]),
      password: new FormControl('', [Validators.pattern("^[0-9A-Za-z]+$}"), Validators.required]),
      chkPsw: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required,Validators.email]),
    });
  }

  /**二次確認密碼 */
  doubleChk():boolean {
    const chk = this.myForm.controls['chkPsw'].value;
    const psw = this.myForm.controls['password'].value;
    if(!chk || !psw){
      return true;
    }
    return chk == psw ? false : true;
  }
  /**檢查Reqest */
  checkReq() {
    if (!this.myForm.valid) {
      Object.keys(this.myForm.controls).forEach(col => {
        if (this.myForm.get(col)?.value == '' || this.myForm.get(col)?.value == null) {
          this.myForm.get(col)?.markAsTouched();
        }
      })

      return null;
    } else {
      return false;
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
    if(sta !== null){
      this.isChkErr = sta;
      if(this.isChkErr){
        this.myForm.get('chkPsw')?.setValue('',Validators.required)
      }
    }
    this.checkReq();
  }
  onCancel(): void {
    this.dialogRef.close({ data: false });
  }
}
