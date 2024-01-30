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
  ChildMccItemListData:MccModel[] = [];
  /**報表內容下拉選單 */
  repContent!: repConModel;
  repContentList: repConModel[] = [];
  col: any;
  /**預設欄位狀態 */
  defaultColumnSta: columnModel[] = [{
    content_id: '',
    column_id: '',
    content_name: "",
    column_sort: '',
    col_account: '',
    col_cutomerID: '',
    col_campaignID: '',
    col_adgroupID: '',
    col_adfinalURL: '',
    col_headline: '',
    col_shortheadline: '',
    col_longheadline: '',
    col_headline_1: '',
    col_headline_2: '',
    col_directions: '',
    col_directions_1: '',
    col_directions_2: '',
    col_adName: '',
    col_adPath_1: '',
    col_adPath_2: '',
    col_srchKeyWord: '',
    col_switchTarget: '',
    col_datetime: '',
    col_week: '',
    col_season: '',
    col_month: '',
    col_income: '',
    col_trans_time: '',
    col_trans_cost_once: '',
    col_trans: '',
    col_trans_rate: '',
    col_click: '',
    col_impression: '',
    col_ctr: '',
    col_cpc: '',
    col_cost: '',
    col_age: '',
    col_sex: '',
    col_region: ''
  }]
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
  }
  changeFormType(value: string) {
    this.mediaType = value;
  }
  /**選擇客戶名稱 */
  changeAcc(data: AccModel): void {
    console.log(data);
    const ChildMccItemListTmp = this.ChildMccItemListData;
    this.ChildMccItemList = ChildMccItemListTmp.filter(x=>x.clientId == data.clientId);
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
  onChangeDefauRepCon(data: any) {
    console.log(data);
    return false;
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
    var deFaultTemp = this.defaultColumnSta.find(x => x.content_id == id);
    repCol.forEach(x => {
      if (x.id == id) {
        x.List = [
          { coltype: "col_campaignID", name: deFaultTemp?.col_campaignID == "1" ? columnMapping.col_campaignID : "", status: deFaultTemp?.col_campaignID },
          { coltype: "col_adgroupID", name: deFaultTemp?.col_adgroupID == "1" ? columnMapping.col_adgroupID : "", status: deFaultTemp?.col_adgroupID },
          { coltype: "col_adfinalURL", name: deFaultTemp?.col_adfinalURL == "1" ? columnMapping.col_adfinalURL : "", status: deFaultTemp?.col_adfinalURL },
          { coltype: "col_headline", name: deFaultTemp?.col_headline == "1" ? columnMapping.col_headline : "", status: deFaultTemp?.col_headline },
          { coltype: "col_shortheadline", name: deFaultTemp?.col_shortheadline == "1" ? columnMapping.col_shortheadline : "", status: deFaultTemp?.col_shortheadline },
          { coltype: "col_longheadline", name: deFaultTemp?.col_longheadline == "1" ? columnMapping.col_longheadline : "", status: deFaultTemp?.col_longheadline },
          { coltype: "col_headline_1", name: deFaultTemp?.col_headline_1 == "1" ? columnMapping.col_headline_1 : "", status: deFaultTemp?.col_headline_1 },
          { coltype: "col_headline_2", name: deFaultTemp?.col_headline_2 == "1" ? columnMapping.col_headline_2 : "", status: deFaultTemp?.col_headline_2 },
          { coltype: "col_directions", name: deFaultTemp?.col_directions == "1" ? columnMapping.col_directions : "", status: deFaultTemp?.col_directions },
          { coltype: "col_directions_1", name: deFaultTemp?.col_directions_1 == "1" ? columnMapping.col_directions_1 : "", status: deFaultTemp?.col_directions_1 },
          { coltype: "col_directions_2", name: deFaultTemp?.col_directions_2 == "1" ? columnMapping.col_directions_2 : "", status: deFaultTemp?.col_directions_2 },
          { coltype: "col_adName", name: deFaultTemp?.col_adName == "1" ? columnMapping.col_adName : "", status: deFaultTemp?.col_adName },
          { coltype: "col_adPath_1", name: deFaultTemp?.col_adPath_1 == "1" ? columnMapping.col_adPath_1 : "", status: deFaultTemp?.col_adPath_1 },
          { coltype: "col_adPath_2", name: deFaultTemp?.col_adPath_2 == "1" ? columnMapping.col_adPath_2 : "", status: deFaultTemp?.col_adPath_2 },
          { coltype: "col_srchKeyWord", name: deFaultTemp?.col_srchKeyWord == "1" ? columnMapping.col_srchKeyWord : "", status: deFaultTemp?.col_srchKeyWord },
          { coltype: "col_switchTarget", name: deFaultTemp?.col_switchTarget == "1" ? columnMapping.col_switchTarget : "", status: deFaultTemp?.col_switchTarget },
          { coltype: "col_datetime", name: deFaultTemp?.col_datetime == "1" ? columnMapping.col_datetime : "", status: deFaultTemp?.col_datetime },
          { coltype: "col_week", name: deFaultTemp?.col_week == "1" ? columnMapping.col_week : "", status: deFaultTemp?.col_week },
          { coltype: "col_season", name: deFaultTemp?.col_season == "1" ? columnMapping.col_season : "", status: deFaultTemp?.col_season },
          { coltype: "col_month", name: deFaultTemp?.col_month == "1" ? columnMapping.col_month : "", status: deFaultTemp?.col_month },
          { coltype: "col_income", name: deFaultTemp?.col_income == "1" ? columnMapping.col_income : "", status: deFaultTemp?.col_income },
          { coltype: "col_trans_time", name: deFaultTemp?.col_trans_time == "1" ? columnMapping.col_trans_time : "", status: deFaultTemp?.col_trans_time },
          { coltype: "col_trans_cost_once", name: deFaultTemp?.col_trans_cost_once == "1" ? columnMapping.col_trans_cost_once : "", status: deFaultTemp?.col_trans_cost_once },
          { coltype: "col_trans", name: deFaultTemp?.col_trans == "1" ? columnMapping.col_trans : "", status: deFaultTemp?.col_trans },
          { coltype: "col_trans_rate", name: deFaultTemp?.col_trans_rate == "1" ? columnMapping.col_trans_rate : "", status: deFaultTemp?.col_trans_rate },
          { coltype: "col_click", name: deFaultTemp?.col_click == "1" ? columnMapping.col_click : "", status: deFaultTemp?.col_click },
          { coltype: "col_impression", name: deFaultTemp?.col_impression == "1" ? columnMapping.col_impression : "", status: deFaultTemp?.col_impression },
          { coltype: "col_ctr", name: deFaultTemp?.col_ctr == "1" ? columnMapping.col_ctr : "", status: deFaultTemp?.col_ctr },
          { coltype: "col_cpc", name: deFaultTemp?.col_cpc == "1" ? columnMapping.col_cpc : "", status: deFaultTemp?.col_cpc },
          { coltype: "col_cost", name: deFaultTemp?.col_cost == "1" ? columnMapping.col_cost : "", status: deFaultTemp?.col_cost },
          { coltype: "col_age", name: deFaultTemp?.col_age == "1" ? columnMapping.col_age : "", status: deFaultTemp?.col_age },
          { coltype: "col_sedeFaultTemp", name: deFaultTemp?.col_sex == "1" ? columnMapping.col_sex : "", status: deFaultTemp?.col_sex },
          { coltype: "col_region", name: deFaultTemp?.col_region == "1" ? columnMapping.col_region : "", status: deFaultTemp?.col_region },
        ]
      }
    })
    console.log(repCol);
    this.columnArray = repCol;
  }

  //#region API事件
  /**客戶名稱API */
  async getClinetName() {
    try {
      const request = {clientId: ""};
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/CustomerInfo/GetCustomer`;
      console.log(qryDataUrl);
      this.apiService.CallApi(qryDataUrl, 'POST',rD).subscribe({
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
  /**客戶子帳戶名稱 */
  async getChildName() {
    try {
      this.msgData = new MsgBoxInfo;
      const qryDataUrl = environment.apiServiceHost + `api/SubClient/GetSubClient`;
      console.log(qryDataUrl);
      this.apiService.CallApi(qryDataUrl, 'POST',{}).subscribe({
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
      const request = {contentID: ""};
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
  /**取得預設欄位 */
  async getDefaultRepContent(id: string) {
    return new Promise<void>((resolve, reject) => {
      try {
        this.msgData = new MsgBoxInfo;
        const qryDataUrl = environment.apiServiceHost + `api/ReportContent/${id}`;
        console.log(qryDataUrl);
        this.apiService.CallApi(qryDataUrl, 'GET', { BaseResponse }).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            if (data.data) {
              //如果第一筆資料是空先清除
              if (this.defaultColumnSta[0].col_account == "") {
                this.defaultColumnSta = [];
              }
              var colstatusData = data.data as columnModel[];
              this.defaultColumnSta.push(colstatusData[0]);
              console.log(this.defaultColumnSta);
              resolve();
            } else {
              var data = res as BaseResponse;
              this.msgData.title = `回應碼${data.code}`;
              this.msgData.msg = `訊息${data.msg}`;
              this.msgBoxService.msgBoxShow(this.msgData);
              reject();
            }
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            reject(error.error);
          },
        });
      }
      catch (e: any) {
        this.msgBoxService.msgBoxShow(e.toString());
      }
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
      content_id: '0',
      column_id: '0',
      content_name: "0",
      column_sort: '0',
      col_account: '0',
      col_cutomerID: '0',
      col_campaignID: '0',
      col_adgroupID: '0',
      col_adfinalURL: '0',
      col_headline: '0',
      col_shortheadline: '1',
      col_longheadline: '1',
      col_headline_1: '1',
      col_headline_2: '1',
      col_directions: '1',
      col_directions_1: '0',
      col_directions_2: '0',
      col_adName: '0',
      col_adPath_1: '0',
      col_adPath_2: '0',
      col_srchKeyWord: '0',
      col_switchTarget: '0',
      col_datetime: '0',
      col_week: '0',
      col_season: '0',
      col_month: '0',
      col_income: '0',
      col_trans_time: '1',
      col_trans_cost_once: '1',
      col_trans: '1',
      col_trans_rate: '0',
      col_click: '0',
      col_impression: '0',
      col_ctr: '0',
      col_cpc: '0',
      col_cost: '0',
      col_age: '0',
      col_sex: '0',
      col_region: '0'
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
