import { data } from 'jquery';
import { ApiService } from './../../service/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MccModel, AccModel, BaseResponse, columnMapping, columnModel, exportSampleManageModels, repConModel, targetMediaModel, targetMapping, repColModel, repColListModel } from '../report-manage.models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MsgBoxService } from 'src/app/service/msg-box.service';
import { MsgBoxInfo } from 'src/app/share/msg-box/msg-box.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-rep-exmple-pop',
  templateUrl: './add-rep-exmple-pop.component.html',
  styleUrls: ['./add-rep-exmple-pop.component.css'],
})
/**新增報表範本 */
export class AddRepExmplePopComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddRepExmplePopComponent>,
    @Inject(MAT_DIALOG_DATA) public inPutdata: any,
    public apiService: ApiService,
    public datePipe: DatePipe,
    private msgBoxService: MsgBoxService) { }
  //#region 資料宣告
  mediaType = "";
  mediaG = "G";
  mediaM = "M"
  /**今日日期 */
  SDtm: Date = new Date();
  /**範本名稱 */
  repExmName: any = "";
  /**目標廣告 */
  targetMedia!: targetMediaModel;
  targetMediaList: targetMediaModel[] = [
    { tMedia_id: "sem", tMedia_name: targetMapping.glg_sem },
    { tMedia_id: "gdn", tMedia_name: targetMapping.glg_gdn },
    { tMedia_id: "yt", tMedia_name: targetMapping.glg_yt },
    { tMedia_id: "shop", tMedia_name: targetMapping.glg_shop },
    { tMedia_id: "pmas", tMedia_name: targetMapping.glg_pmas },
  ];
  /**客戶名稱下拉選單 */
  AccItem!: AccModel;
  AccItemList: AccModel[] = [];
  /**帳戶名稱(MCC)下拉選單 */
  // MccItem: any;
  // MccItemList: AccChildModel[] = [];
  /**子帳戶名稱(帳戶活動)下拉選單 */
  ChildMccItem!: MccModel;
  ChildMccItemList: MccModel[] = [];
  ChildMccItemListData: MccModel[] = [];
  /**報表內容下拉選單 */
  repContent!: repConModel;
  repContentList: repConModel[] = [];
  col: any;
  /**預設欄位狀態 */
  defaultColumnSta: columnModel[] = [];
  /**報表全部欄位關鍵搜尋下拉選單 */
  colList = [
    { value: '01', viewValue: '週期', targetM: "" },
    { value: '02', viewValue: '廣告活動', targetM: "" },
    { value: '03', viewValue: '年齡區間', targetM: "" },
    { value: '04', viewValue: '性別', targetM: "" },
    { value: '05', viewValue: '地區', targetM: "" },
    { value: '06', viewValue: '廣告群組', targetM: "" }
  ];
  columnArray: repColModel[] = [];
  columnList = [{ coltype: "", name: "", status: "" },];
  msgData = new MsgBoxInfo;
  //#endregion

  async ngOnInit(): Promise<void> {
    this.mediaType = "";
    console.log(this.columnArray);
    await this.getClinetName();
    await this.getChildName();
    await this.getReportContent();
    await this.getDefaultRepContent();
  }
  changeFormType(value: string) {
    this.mediaType = value;
  }
  /**選擇客戶名稱 */
  changeAcc(data: AccModel): void {
    console.log(data);
    const ChildMccItemListTmp = this.ChildMccItemListData;
    this.ChildMccItemList = ChildMccItemListTmp.filter(x => x.clientId == data.clientId);
  }
  /**選帳戶活動名稱 */
  changeMcc(data: MccModel) {
    //pop 取得最後一個
    //我們使用可選鏈操作符 ?. 來確保在 client_subname 為 undefined 時不會拋出異常。
    //空值合併操作符 ?? 用於提供一個備用值，如果 pop() 結果為 undefined，則預設為空字串
    const kw: string = data.subName?.split('_').pop() ?? "";
    var res = this.targetMediaList.filter(x => x.tMedia_id.toLowerCase().includes(kw.toLowerCase()));
    console.log(res);
    this.targetMedia = res[0];
  }
  /**欄位拖移 */
  drop(event: CdkDragDrop<[]>) {
    console.log(event);
    moveItemInArray(this.columnList, event.previousIndex, event.currentIndex);
    console.log(this.columnList);
  }
  /**新增報表欄位*/
  addCol(data: any) {
    console.log(data);
    var a = $("addCol").val();
    console.log(a);
  }
  /**刪除報表欄位 */
  onRemoveCol(data: any) {
    console.log(data);
    var itemIndex = this.columnList.findIndex(x => x.name == data.name);
    this.columnList.splice(itemIndex, 1);
    console.log(this.columnList);
  }
  /**預設報表欄位change */
  onChangeDefauRepCon(sta:any,data:any) {
    if(sta.source._selected){

    }
    console.log(data);
    console.log(sta.source._selected);
    // return new Promise(reslove => {

    // });
    // data.forEach(async (x: repConModel) => {
    //   if (x.status == false) {
    //     x.status = true;
    //     var temp = new repColModel();
    //     temp.id = x.contentID;
    //     temp.name = x.contentName;
    //     temp.List = [
    //       { coltype: "col_campaignID", name: "", status: "" },
    //       { coltype: "col_adgroupID", name: "", status: "" },
    //       { coltype: "col_adfinalURL", name: "", status: "" },
    //       { coltype: "col_headline", name: "", status: "" },
    //       { coltype: "col_shortheadline", name: "", status: "" },
    //       { coltype: "col_longheadline", name: "", status: "" },
    //       { coltype: "col_headline_1", name: "", status: "" },
    //       { coltype: "col_headline_2", name: "", status: "" },
    //       { coltype: "col_directions_1", name: "", status: "" },
    //       { coltype: "col_directions_2", name: "", status: "" },
    //       { coltype: "col_adName", name: "", status: "" },
    //       { coltype: "col_adPath_1", name: "", status: "" },
    //       { coltype: "col_adPath_2", name: "", status: "" },
    //       { coltype: "col_srchKeyWord", name: "", status: "" },
    //       { coltype: "col_switchTarget", name: "", status: "" },
    //       { coltype: "col_datetime", name: "", status: "" },
    //       { coltype: "col_week", name: "", status: "" },
    //       { coltype: "col_season", name: "", status: "" },
    //       { coltype: "col_month", name: "", status: "" },
    //       { coltype: "col_income", name: "", status: "" },
    //       { coltype: "col_trans_time", name: "", status: "" },
    //       { coltype: "col_trans_cost_once", name: "", status: "" },
    //       { coltype: "col_trans", name: "", status: "" },
    //       { coltype: "col_trans_rate", name: "", status: "" },
    //       { coltype: "col_click", name: "", status: "" },
    //       { coltype: "col_impression", name: "", status: "" },
    //       { coltype: "col_ctr", name: "", status: "" },
    //       { coltype: "col_cpc", name: "", status: "" },
    //       { coltype: "col_cost", name: "", status: "" },
    //       { coltype: "col_age", name: "", status: "" },
    //       { coltype: "col_sex", name: "", status: "" },
    //       { coltype: "col_region", name: "", status: "" },
    //     ];
    //     await this.getDefaultRepContent(x.contentID);

    //     this.columnArray.push(temp);
    //     this.setDefaultCol(x.contentID, this.columnArray);
    //   }
    // });
    // console.log(this.columnArray);
  }
  /**設定預設欄位 */
  setDefaultCol(id: any, repCol: repColModel[]) {

  }

  //#region API事件
  /**客戶名稱API */
  async getClinetName() {
    try {
      const request = { clientId: "" };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/CustomerInfo/GetCustomer`;
      console.log(qryDataUrl);
      this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
        next: (res) => {
          var data = res as BaseResponse;
          //console.log(a.data);
          if (data) {
            data.data.forEach((x: AccModel) => {
              this.AccItemList.push(x);
            });
            console.log(this.AccItemList);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
      });
    }
    catch (e: any) {
      this.msgBoxService.msgBoxShow(e.toString());
    }
  }
  /**客戶子帳戶名稱 API*/
  async getChildName() {
    try {
      this.msgData = new MsgBoxInfo;
      const qryDataUrl = environment.apiServiceHost + `api/SubClient/GetSubClient`;
      console.log(qryDataUrl);
      this.apiService.CallApi(qryDataUrl, 'POST', {}).subscribe({
        next: (res) => {
          var data = res as BaseResponse;

          if (data) {
            data.data.forEach((x: MccModel) => {
              this.ChildMccItemListData.push(x);
            });
            console.log(this.ChildMccItemListData);
          } else {
            var data = res as BaseResponse;
            this.msgData.title = `回應碼${data.code}`;
            this.msgData.msg = `訊息${data.msg}`;
            this.msgBoxService.msgBoxShow(this.msgData);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
      });
    }
    catch (e: any) {
      this.msgBoxService.msgBoxShow(e.toString());
    }
  }
  /**報表內容下拉選單api */
  async getReportContent() {
    try {
      const request = { contentID: "" };
      let rD = JSON.stringify(request);
      this.msgData = new MsgBoxInfo;
      const qryDataUrl = environment.apiServiceHost + `api/ReportContentInfo/GetReportContent`;
      console.log(qryDataUrl);
      this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
        next: (res) => {
          var data = res as BaseResponse;
          if (data.data) {
            data.data.forEach((x: repConModel) => {
              x.status = false;
              this.repContentList.push(x);
            });
            console.log(data.data);
          } else {
            var data = res as BaseResponse;
            this.msgData.title = `回應碼${data.code}`;
            this.msgData.msg = `訊息${data.msg}`;
            this.msgBoxService.msgBoxShow(this.msgData);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
      });
    }
    catch (e: any) {
      this.msgBoxService.msgBoxShow(e.toString());
    }
  }
  /**取得預設欄位 API */
  getDefaultRepContent() {
    return new Promise<void>((resolve) => {
      const path = environment.apiServiceHost + `api/ReportContentInfo/GetReportDefaultFields`;
      this.apiService.CallApi(path, 'POST').subscribe({
        next: (res) => {
          var data = res as BaseResponse;
          if (data.data) {
            this.defaultColumnSta = data.data;
            console.log(this.defaultColumnSta);
            resolve();
          } else {
            var data = res as BaseResponse;
            this.msgData.title = `回應碼${data.code}`;
            this.msgData.msg = `訊息${data.msg}`;
            this.msgBoxService.msgBoxShow(this.msgData);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
      });
    })

  }
  /**新增報表範本 */
  async addExmRep() {

    const shareid = this.inPutdata.padStart(4, '0');
    const repid = `${this.AccItem.clientId}_report_${shareid}`;
    const subName = this.ChildMccItem.subName;
    const subID = this.ChildMccItem.clientId;
    const goal = this.targetMedia.tMedia_name;
    const media = this.mediaType == "G" ? "ADS" : "META"
    const colid = `col${shareid}`;
    const cname = "weider"
    const date = this.SDtm;
    var reqData = { report: {}, col: {} };
    var reqRepot: exportSampleManageModels = {
      report_id: repid,
      report_name: this.repExmName,
      client_subname: subName,
      report_goalads: goal,
      report_media: media,
      column_id: colid,
      creat_cname: cname,
      creat_date: "",
      edit_cname: '',
      edit_date: "",
      report_status: '1',
      sub_id: subID
    };
    var reqCol: columnModel = {
      contentId: '',
      columnId: null,
      isColAccount: false,
      isColCutomerID: false,
      isColCampaignName: false,
      isColAdGroupName: false,
      isColAdFinalURL: false,
      isColHeadline: false,
      isColShortHeadLine: false,
      isColLongHeadLine: false,
      isColHeadLine_1: false,
      isColHeadLine_2: false,
      isColDirections: false,
      isColDirections_1: false,
      isColDirections_2: false,
      isColAdName: false,
      isColAdPath_1: false,
      isColAdPath_2: false,
      isColSrchKeyWord: false,
      isColSwitchTarget: false,
      isColDateTime: false,
      isColWeek: false,
      isColSeason: false,
      isColMonth: false,
      isColIncome: false,
      isColTransTime: false,
      isColTransCostOnce: false,
      isColTrans: false,
      isColTransRate: false,
      isColClick: false,
      isColImpression: false,
      isColCTR: false,
      isColCPC: false,
      isColCost: false,
      isColAge: false,
      isColSex: false,
      isColRegion: false,
      contentSort: '',
      contentName: ''
    };
    /**To Do 欄位修改 先寫固定*/
    //reqCol = this.defaultColumnSta;
    reqData.report = reqRepot;
    reqData.col = reqCol;
    var rD = JSON.stringify(reqData);
    console.log(rD);
    console.log(reqData);
    const qryDataUrl = environment.apiServiceHost + `api/Report`;
    console.log(qryDataUrl);
    this.apiService.CallApi(qryDataUrl, 'POST', rD, "json").subscribe({
      next: (res) => {
        var data = res as BaseResponse;
        //console.log(a.data);
        if (data) {
          console.log(data);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
      },
    });
  }
  catch(e: any) {
    this.msgBoxService.msgBoxShow(e.toString());
  }

  //#endregion


  //#region CSS事件
  //設定狀態按鈕CSS
  setStatusClass(d: any, s: any) {
    //console.log(d);
    let css = "";
    if (d == s) {
      css = "btnStatusSelect";
    } else {
      css = "btnStatus";
    }
    return css;
  }
  //#endregion
  onOk(): void {
    /**todo 資料審核 */
    this.addExmRep();
    this.dialogRef.close({ data: false });
  }
  onCancel(): void {
    this.dialogRef.close({ data: false });
  }
}
