import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Injectable } from "@angular/core";

import { Observable } from 'rxjs';
import { MsgBoxComponent, MsgBoxResult } from '../share/msg-box/msg-box.component';

@Injectable({
  providedIn: 'root',
})

export class MsgBoxService {
  constructor(private dialog: MatDialog) { }
  private dialogRef!: MatDialogRef<any, any>;
  /**使用方法
* 1. 在自己的專案ts檔,private msgBoxService: MsgBoxService
* 2. data = new MsgBoxInfo,
*    data.msg=>你要傳的訊息內容,
     data.title=>跳窗標題(預設:"提示"),
     data.BtnType=>按鈕模式(MsgBoxBtnType型態,預設:ok)
     如果單純傳訊息=>this.msgBoxService.msgBoxShow("請選取要刪除的資料!!");
* 3. 呼叫一般提示跳窗=>this.msgBoxService.msgBoxShow(data);
* 4. 如果要抓取跳窗結束的回傳內容=>
     const msgResult = await this.msgBoxService.msgBoxShow(this.temp);
     if(msgResult.result == DialogResult.xxx) {}
*/
  private callMsg(data?: any, width?: string, height?: string, hasBackdrop?: boolean, disableClose?: boolean): Observable<MsgBoxResult> {
    this.dialogRef = this.dialog.open(MsgBoxComponent, {
      width: width,
      height: height,
      data: data,
      hasBackdrop: hasBackdrop ? hasBackdrop : true,
      disableClose: disableClose ? disableClose : true,
    });
    return this.dialogRef.afterClosed();
  }

  /**彈出訊息視窗 */
  msgBoxShow(data?: any, width?: string, height?: string, hasBackdrop?: boolean, disableClose?: boolean): Promise<MsgBoxResult | undefined> {
    return this.callMsg(data, width, height, hasBackdrop, disableClose).toPromise();
  }
}

