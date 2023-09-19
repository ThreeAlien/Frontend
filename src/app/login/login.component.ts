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

  async onSubmit(): Promise<void>{
    var sta = await this.clientSSO.onLogin();
    if(sta == "1"){
      console.log("按下登入回傳一")
      this.router.navigate(["/home"]);
    }else{
      alert("登入認證失敗!!")
    }
  }
}
