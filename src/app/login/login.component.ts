import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientSSOService } from '../service/client-sso.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(
    private clientSSO : ClientSSOService,
    private router: Router,
    private  formBuilder: FormBuilder,
    ){}
  ngOnInit() {

  }

  async onLogin(): Promise<void>{
    let longinSta = this.clientSSO.onLogin();
    if(await longinSta){
      console.log("按下登入回傳一")
      this.router.navigate(["/home"]);
    }else{
      alert("登入認證失敗!!")
    }
  }
}
