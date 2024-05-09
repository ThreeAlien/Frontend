
import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { NgStyle, NgIf } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-msg-box',
    templateUrl: './msg-box.component.html',
    styleUrls: ['./msg-box.component.css'],
    standalone: true,
    imports: [MatIconModule, NgStyle, NgIf, MatButtonModule]
})
export class MsgBoxComponent implements OnInit {

  /**視窗樣式 */
  public msgBox: MsgBoxInfo = new MsgBoxInfo;

  constructor(
    public dialog: MatDialogRef<MsgBoxComponent>,
    @Inject(MAT_DIALOG_DATA) public inputData:MsgBoxInfo)
    {}

  /**初始化 */
  ngOnInit() {

    const msgBoxInfo = new MsgBoxInfo();
    const inputInfo = this.inputData;
    console.log(inputInfo);
    if(inputInfo?.msg) {

      msgBoxInfo.msg = this.replaceMsg(inputInfo.msg);

      if(inputInfo.title) {
        msgBoxInfo.title = inputInfo.title;
      }

      if (inputInfo.btnType) {
        msgBoxInfo.btnType = inputInfo.btnType;
      }

      //#region 大小
      if(inputInfo.maxWidth) {
        msgBoxInfo.maxWidth = inputInfo.maxWidth;
      }
      if(inputInfo.maxHeight) {
        msgBoxInfo.maxHeight = inputInfo.maxHeight;
      }
      if(inputInfo.minWidth) {
        msgBoxInfo.minWidth = inputInfo.minWidth;
      }
      if(inputInfo.minHeight) {
        msgBoxInfo.minHeight = inputInfo.minHeight;
      }
      //#endregion

      //#region 按鈕名稱
      if(inputInfo.btnTxtOk) {
        msgBoxInfo.btnTxtOk = inputInfo.btnTxtOk;
      }
      if(inputInfo.btnTxtCancel) {
        msgBoxInfo.btnTxtCancel = inputInfo.btnTxtCancel;
      }
      if(inputInfo.btnTxtYes) {
        msgBoxInfo.btnTxtYes = inputInfo.btnTxtYes;
      }
      if(inputInfo.btnTxtNo) {
        msgBoxInfo.btnTxtNo = inputInfo.btnTxtNo;
      }
      //#endregion

    } else {
      msgBoxInfo.msg = this.inputData.msg;
    }

    if(!msgBoxInfo.msg) {
      msgBoxInfo.msg = " ";
    }

    this.msgBox = msgBoxInfo;
  }

  /**右上關閉 */
  public onClose() {
    this.closeUI(DialogResult.none);
  }
  /**確定 */
  public onOk() {
    this.closeUI(DialogResult.ok);
  }
  /**取消 */
  public onCancel() {
    this.closeUI(DialogResult.cancel);
  }
  /**是 */
  public onYes() {
    this.closeUI(DialogResult.yes);
  }
  /**否 */
  public onNo() {
    this.closeUI(DialogResult.no);
  }

  /**關閉視窗回傳結果 */
  private closeUI(result: DialogResult) {

    const res = new MsgBoxResult();
    res.title = this.msgBox.title;
    res.btnType = this.msgBox.btnType;
    res.msg = this.msgBox.msg;
    res.result = result;

    this.dialog.close(res);
  }

  /**檢查輸入大小 */
  private chkCanSetSize(size: number) {
    return size > 0;
  }
  /**取代換行符號 */
  private replaceMsg(msg: string): string {
    return msg; // 改用 <pre> 有支援換行符號 \n
    //return msg?.replace(/\n/g, '<br />'); // for InnerHTML
  }
}

/**按鈕類型 */
export enum MsgBoxBtnType {
  /**確認 */
  ok = "ok",
  /**確認+取消 */
  ok_cancel = "ok_cancel",
  /**是+否 */
  yes_no = "yes_no",
}

/**視窗樣式 */
class MsgBase {
  /**訊息 */
  public msg: string = " ";
  /**標題 */
  public title?: string = "提示";
  /**按鈕類型 */
  public btnType?: MsgBoxBtnType = MsgBoxBtnType.ok;
}
/**視窗樣式擴充 */
export class MsgBoxInfo extends MsgBase {
  /**訊息最大寬度 */
  public maxWidth?: number;
  /**訊息最大高度 */
  public maxHeight?: number ;
  /**訊息最小寬度 */
  public minWidth?: number = 400;
  /**訊息最小高度 */
  public minHeight?: number;

  /**Ok 按鈕名稱 */
  public btnTxtOk?: string = "確認";
  /**Cancel 按鈕名稱 */
  public btnTxtCancel?: string = "取消";
  /**Yes 按鈕名稱 */
  public btnTxtYes?: string = "是";
  /**No 按鈕名稱 */
  public btnTxtNo?: string = "否";
}
/**按鈕結果 */
export enum DialogResult {
  /**預設(未選擇) */
  none = "none",
  /**確認 */
  ok = "ok",
  /**取消 */
  cancel = "cancel",
  /**是 */
  yes = "yes",
  /**否 */
  no = "no",
}
/**視窗回應物件 */
export class MsgBoxResult extends MsgBase {

  /**按鈕結果 */
  public result!: DialogResult;
}

