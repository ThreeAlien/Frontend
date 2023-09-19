import { Component, OnInit } from '@angular/core';
import { MsgBoxService } from 'src/app/service/msg-box.service';
import { MsgBoxBtnType, MsgBoxInfo } from 'src/app/share/msg-box/msg-box.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.css']
})
export class TopComponent implements OnInit {

  constructor(private msgBoxService: MsgBoxService) { }

  data = new MsgBoxInfo;
  title = environment.production ? '' : '測試區';
  loginName = "馮迪索";

  ngOnInit(): void {

    this.data.msg = "測試喔";
    this.data.title ="Test";
    this.data.btnType = MsgBoxBtnType.ok_cancel;
  }
  onLogout(){
    this.msgBoxService.msgBoxShow(this.data);
  }

}
