import { data } from 'jquery';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from './../../../service/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MccModel, AccModel, columnMapping, columnModel, repConModel, reportGoalAdsModel, GoalAdsMapping, repColModel, repColListModel, addReportRequest as setReportRequest, columnDataReq, exportSampleModels, getReportDetailRes } from '../report-manage.models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MsgBoxService } from 'src/app/service/msg-box.service';
import { MsgBoxInfo } from 'src/app/share/msg-box/msg-box.component';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { SetColumnPopComponent } from '../set-column-pop/set-column-pop.component';
import { BaseResponse } from 'src/app/share/Models/share.model';
import { LoadingService } from 'src/app/service/loading.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-add-rep-exmple-pop',
  templateUrl: './add-rep-exmple-pop.component.html',
  styleUrls: ['./add-rep-exmple-pop.component.css'],
})
/**新增報表範本 */
export class AddRepExmplePopComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddRepExmplePopComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public inPutdata: any,
    public apiService: ApiService,
    public datePipe: DatePipe,
    private msgBoxService: MsgBoxService, public loadingService: LoadingService, private messageService: MessageService) { }
  //#region 資料宣告
  mediaType = "";
  mediaG = "G";
  mediaM = "M"
  /**今日日期 */
  SDtm: Date = new Date();
  /**範本名稱 */
  repExmName: any = "";
  /**目標廣告 */
  reportGoalAds!: reportGoalAdsModel;
  reportGoalAdsList: reportGoalAdsModel[] = [
    { goalId: "sem", goalName: GoalAdsMapping.glgSem },
    { goalId: "gdn", goalName: GoalAdsMapping.glgGdn },
    { goalId: "yt", goalName: GoalAdsMapping.glgYt },
    { goalId: "shop", goalName: GoalAdsMapping.glgShop },
    { goalId: "pmas", goalName: GoalAdsMapping.glgPmas },
    { goalId: "kw", goalName: GoalAdsMapping.glgKw },
  ];
  /**客戶名稱下拉選單 */
  AccData: string = "";
  AccItem!: AccModel;

  AccItemList: AccModel[] = [];
  /**帳戶名稱(MCC)下拉選單 */
  // MccItem: any;
  // MccItemList: AccChildModel[] = [];
  /**子帳戶名稱(帳戶活動)下拉選單 */
  ChildMccItem!: MccModel;
  //前端畫面用
  ChildMccItemList: MccModel[] = [];
  //資料儲存用
  ChildMccItemListData: MccModel[] = [];
  /**報表內容下拉選單 */
  repContent!: repConModel;
  repContentList: repConModel[] = [];
  col: any;
  /**預設欄位狀態 */
  defaultColumnSta: columnModel[] = [];
  /**權限帳號 */
  PermissionsData = [];
  columnArray: repColModel[] = [];
  msgData = new MsgBoxInfo;
  /**表單是否是編輯或新增 */
  formType: string = "";
  formEditTitle: string = "";
  editData: exportSampleModels | undefined;
  reportId!: string;
  /**暫存原本DB報表內容欄位 */
  tmpDBReportColumn: repConModel[] = [];

  myForm = new FormGroup({
    AccItem: new FormControl(this.AccItem, Validators.required),
    ChildMccItem: new FormControl(this.ChildMccItem, Validators.required),
    targetMedia: new FormControl(this.reportGoalAds, Validators.required),
    repContent: new FormControl(),
    repExmName: new FormControl('', Validators.required),
  });
  dataCount: string = "";
  selectedCarObj = {};
  //#endregion

  async ngOnInit(): Promise<void> {
    this.mediaType = "G";
    await this.getClinetName();
    this.loadingService.loadingOn();
    await this.getChildName();
    await this.getReportContent();
    await this.getDefaultRepContent();
    const pData = localStorage.getItem('USER_ADSINFO');
    if (pData) {
      this.PermissionsData = JSON.parse(pData);
    }
    if (this.isSetPermission()) {
      await this.setPermission();
    }
    console.log(this.inPutdata);
    /**編輯狀態下塞值 */
    if (this.inPutdata.type == "edit") {
      this.formType = this.inPutdata.type;
      this.editData = this.inPutdata.data;
      console.log("你進入編輯狀態");
      if (this.editData) {
        let colId = this.editData.columnID;
        console.log(colId);
        await this.getReportDetail(colId);
        this.reportId = this.editData.reportID;
        this.formEditTitle = this.editData.reportName;
        this.myForm.controls.repExmName.setValue(this.editData.reportName);
        this.AccItemList.forEach(x => {
          if (x.clientId == this.editData?.clienId) {
            this.myForm.controls.AccItem.setValue(x);
            const ChildMccItemListTmp = this.ChildMccItemListData;
            this.ChildMccItemList = ChildMccItemListTmp.filter(y => y.clientId == x.clientId);
          }
        })
        this.ChildMccItemList.forEach(x => {
          if (x.subId == this.editData?.subID) {
            this.myForm.controls.ChildMccItem.setValue(x);
          }
        })
        this.reportGoalAdsList.forEach(x => {
          if (x.goalName == this.editData?.reportGoalAds) {
            this.myForm.controls.targetMedia.setValue(x);
          }
        })
      }
    } else {
      this.dataCount = this.inPutdata.data;
      this.formType = this.inPutdata.type;
    }
    this.loadingService.loadingOff();
  }
  onChange(data: any) {
    console.log(data);
    this.AccItem = data.value;
    console.log(this.AccItem);

  }
  /**如果擁有汎古主帳號 權限全開*/
  isSetPermission(): boolean {
    for (let i = 0; i < this.PermissionsData.length; i++) {
      if (this.PermissionsData[i] == '3255036910') {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }
  setPermission() {
    return new Promise<void>((resolve) => {
      let tmpPermissionChild: MccModel[] = [];
      this.PermissionsData.forEach(y => {
        this.ChildMccItemListData.forEach(x => {
          if (x.subId == y) {
            tmpPermissionChild.push(x);
          }
        })
      });
      let tmpPermissionMain: AccModel[] = [];
      this.ChildMccItemListData = tmpPermissionChild;
      this.AccItemList.forEach(x => {
        this.ChildMccItemListData.forEach(y => {
          if (x.clientId == y.clientId) {
            tmpPermissionMain.push(x);
          }
        })
      })
      this.AccItemList = tmpPermissionMain;
      resolve();
      console.log(this.AccItemList);
    })
  }
  changeFormType(value: string) {
    this.mediaType = value;
  }
  /**選擇客戶名稱 */
  changeAcc(data: any): void {
    if (data.value) {
      this.AccItem = data.value;
      data = data.value;
      let anyData: any;
      this.myForm.controls.repContent.setValue(anyData);
      this.myForm.controls.repExmName.setValue('');
      this.myForm.controls.targetMedia.setValue(anyData);
      const ChildMccItemListTmp = this.ChildMccItemListData;
      this.ChildMccItemList = ChildMccItemListTmp.filter(x => x.clientId == data.clientId);
      if(this.ChildMccItemList.length ==0){
        this.messageService.add({ severity: 'error', summary: '錯誤', detail: '查無子帳戶活動名稱!' })
      }
    }
  }
  /**選帳戶活動名稱 */
  changeMcc(data: MccModel) {
    console.log(data);
    //pop 取得最後一個
    //來確保在 client_subname 為 undefined 時不會拋出異常。
    //如果 pop() 結果為 undefined，則預設為空字串
    const kw: string = data.subName?.split('_').pop() ?? "";
    var res = this.reportGoalAdsList.filter(x => x.goalId.toLowerCase().includes(kw.toLowerCase()));
    this.myForm.controls.targetMedia.setValue(res[0]);
  }
  /**欄位拖移 */
  drop(event: CdkDragDrop<[]>, data: any) {
    moveItemInArray(data.TrueList, event.previousIndex, event.currentIndex);
    console.log(this.columnArray);
  }
  /**刪除報表欄位 */
  onRemoveCol(dataList: repColModel, rmData: repColListModel) {
    console.log(dataList, rmData);
    dataList.TrueList = dataList.TrueList.filter(x => {
      if (x.colName == rmData.colName) {
        dataList.FalseList.push({
          colName: rmData.colName, colStatus: false
        });
        return false;
      }
      return true;
    })
  }
  /**預設報表欄位change */
  onChangeDefauRepCon(sta: any, data: repConModel) {
    this.columnArray.filter(x => x.conId == data.contentID)[0].conStatus = sta.source._selected;
  }
  /**設定欄位是否顯示 */
  setColClick(data: repColModel) {
    const dialogRef = this.dialog.open(SetColumnPopComponent, {
      width: "auto",
      maxHeight: "auto",
      data: { tureList: JSON.stringify(data.TrueList), falseList: JSON.stringify(data.FalseList), conName: data.conName },
      hasBackdrop: true,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result.data) {
        this.columnArray.forEach(x => {
          if (x.conId == data.conId) {
            x.TrueList = JSON.parse(result.data.tureList);
            x.FalseList = JSON.parse(result.data.falseList);
          }
        })
        data.TrueList = JSON.parse(result.data.tureList);
        data.FalseList = JSON.parse(result.data.falseList);
      }
    });
  }
  /**檢查要新增或編輯報表Reqest並且塞入值 */
  checkReq() {
    if (!this.myForm.valid) {
      Object.keys(this.myForm.controls).forEach(col => {
        if (this.myForm.get(col)?.value == '' || this.myForm.get(col)?.value == null) {
          this.myForm.get(col)?.markAsTouched();
        }
      })
      this.messageService.add({ severity: 'error', summary: '錯誤', detail: '請確認欄位是否已填寫!' })
      return null;
    } else {
      let now = new Date();
      let nowday = this.datePipe.transform(now, "yyyyMMdd")
      const shareid = Number(this.dataCount) + 1;
      const repid = `RP_${nowday}${shareid}`;
      const reptName = this.myForm.controls.repExmName.value;
      const subID = this.myForm.controls.ChildMccItem.value?.subId;
      const tMedia = this.myForm.controls.targetMedia.value?.goalId;
      const media = this.mediaType == "G" ? "google" : "META";
      const cname = "weider"
      const date = this.SDtm;
      let setData: setReportRequest = {
        reportId: '',
        reportName: '',
        reportGoalAds: '',
        reportMedia: '',
        editer: '',
        editDate: undefined,
        subID: '',
        creater: '',
        createDate: undefined,
        reportStatus: false,
        columnData: []
      };
      if (this.formType == "edit") {
        setData.reportId = this.reportId,
          setData.reportName = reptName ? reptName : '',
          setData.reportGoalAds = tMedia ? tMedia : '',
          setData.reportMedia = media,
          setData.subID = subID ? subID : '',
          setData.editer = cname,
          setData.editDate = date,
          setData.reportStatus = true
      }
      if (this.formType == "add") {
        setData.reportId = repid,
          setData.reportName = reptName ? reptName : '',
          setData.reportGoalAds = tMedia ? tMedia : '',
          setData.reportMedia = media,
          setData.subID = subID ? subID : '',
          setData.creater = cname,
          setData.createDate = date,
          setData.reportStatus = true
      }
      return setData;
    }

  }
  //#region API事件
  /**客戶名稱API */
  async getClinetName() {
    try {
      const request = { clientId: "" };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/CustomerInfo/GetCustomer`;
      console.log(qryDataUrl);
      return new Promise<void>((resolve) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            if (data) {
              data.data.forEach((x: AccModel) => {
                this.AccItemList.push(x);
              });
            }
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
          }
        });
      })
    }
    catch (e: any) {
      this.msgBoxService.msgBoxShow(e.toString());
    }
  }
  /**子帳戶活動名稱 API*/
  async getChildName() {
    try {
      this.msgData = new MsgBoxInfo;
      const qryDataUrl = environment.apiServiceHost + `api/SubClient/GetSubClient`;
      console.log(qryDataUrl);
      return new Promise<void>((resolve) => {
        this.apiService.CallApi(qryDataUrl, 'POST', {}).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            if (data) {
              data.data.forEach((x: MccModel) => {
                this.ChildMccItemListData.push(x);
              });
            } else {
              var data = res as BaseResponse;
              this.msgData.title = `回應碼${data.code}`;
              this.msgData.msg = `訊息${data.msg}`;
              this.msgBoxService.msgBoxShow(this.msgData);
            }
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
          },
        });
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
            console.log(data.data)
            data.data.forEach((x: repConModel) => {
              x.status = false;
              this.repContentList.push(x);
            });
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
          let repColList: repColListModel[];
          if (data.data) {
            console.log(data.data);
            this.defaultColumnSta = data.data;
            this.defaultColumnSta.forEach(x => {
              repColList = [
                { colName: columnMapping.colCampaignName, colStatus: x.isColCampaignName },
                { colName: columnMapping.colAccount, colStatus: x.isColAccount },
                { colName: columnMapping.colCutomerID, colStatus: x.isColCutomerID },
                { colName: columnMapping.colCPA, colStatus: x.isColCPA },
                { colName: columnMapping.colAdGroupName, colStatus: x.isColAdGroupName },
                { colName: columnMapping.colAdFinalURL, colStatus: x.isColAdFinalURL },
                { colName: columnMapping.colHeadline, colStatus: x.isColHeadline },
                { colName: columnMapping.colHeadLine_1, colStatus: x.isColHeadLine_1 },
                { colName: columnMapping.colHeadLine_2, colStatus: x.isColHeadLine_2 },
                { colName: columnMapping.colDirections, colStatus: x.isColDirections },
                { colName: columnMapping.colDirections_1, colStatus: x.isColDirections_1 },
                { colName: columnMapping.colDirections_2, colStatus: x.isColDirections_2 },
                { colName: columnMapping.colAdName, colStatus: x.isColAdName },
                { colName: columnMapping.colSrchKeyWord, colStatus: x.isColSrchKeyWord },
                { colName: columnMapping.colClicks, colStatus: x.isColClicks },
                { colName: columnMapping.colImpressions, colStatus: x.isColImpressions },
                { colName: columnMapping.colCTR, colStatus: x.isColCTR },
                { colName: columnMapping.colCpc, colStatus: x.isColCPC },
                { colName: columnMapping.colCost, colStatus: x.isColCost },
                { colName: columnMapping.colAge, colStatus: x.isColAge },
                { colName: columnMapping.colCon, colStatus: x.isColCon },
                { colName: columnMapping.colConAction, colStatus: x.isColConAction },
                { colName: columnMapping.colConGoal, colStatus: x.isColConByDate },
                { colName: columnMapping.colConByDate, colStatus: x.isColConGoal },
                { colName: columnMapping.colGender, colStatus: x.isColGender },
                { colName: columnMapping.colConPerCost, colStatus: x.isColConPerCost },
                { colName: columnMapping.colConRate, colStatus: x.isColConRate },
                { colName: columnMapping.colConValue, colStatus: x.isColConValue },
                { colName: columnMapping.colConstant, colStatus: x.isColConstant },
                // { colName: columnMapping.colStartDate, colStatus: x.isColStartDate },
                // { colName: columnMapping.colEndDate, colStatus: x.isColEndDate }
              ];
              var tList = repColList.filter(x => x.colStatus == true);
              var fList = repColList.filter(x => x.colStatus == false);
              this.columnArray.push({
                conId: x.contentId,
                conName: x.contentName,
                conStatus: false,
                TrueList: tList,
                FalseList: fList,
              });
            })
            resolve();
          } else {
            var data = res as BaseResponse;
            this.msgData.title = `回應碼${data.code}`;
            this.msgData.msg = `訊息${data.msg}`;
            this.msgBoxService.msgBoxShow(this.msgData);
            resolve();
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
      });
    })

  }
  /**新增或編輯報表範本 API*/
  async setReport(type: string) {
    let reqData = this.checkReq();
    let path: string;
    if (type == "edit") {
      path = environment.apiServiceHost + `api/ReportInfo/UpdateReport`;
    }
    if (type == "add") {
      path = environment.apiServiceHost + `api/ReportInfo/CreateReport`;
    }
    if (reqData) {
      console.log(this.columnArray);
      //#region  資料處理
      //先把 有勾的報表內容 紀錄起來
      //編輯狀態下
      if (this.formType == "edit") {
        this.columnArray.forEach(x => {

          if (x.conStatus == true) {
            reqData?.columnData.push({
              reportNo: 0,
              contentId: x.conId,
              colAccount: false,
              colCutomerID: false,
              colCampaignName: false,
              colAdGroupName: false,
              colAdFinalURL: false,
              colHeadline: false,
              colHeadLine_1: false,
              colHeadLine_2: false,
              colDirections: false,
              colDirections_1: false,
              colDirections_2: false,
              colAdName: false,
              colSrchKeyWord: false,
              colConGoal: false,
              colConValue: false,
              colConByDate: false,
              colConPerCost: false,
              colCon: false,
              colConRate: false,
              colClicks: false,
              colImpressions: false,
              colCTR: false,
              colCPC: false,
              colCost: false,
              colAge: false,
              colGender: false,
              colConstant: false,
              colConAction: false,
              colCPA: false,
              colStartDate: false,
              colEndDate: false,
              isDelete: false,
            })
          }
        })
        console.log(this.tmpDBReportColumn);
        this.columnArray.forEach(x => {
          this.tmpDBReportColumn.forEach(y => {
            //如果有檢查到原本DB column 是有的, 可是送出的時候發現沒在裡面，要把DB的砍掉 ，isDelete 是true
            if (this.formType == "edit" && x.conStatus == false && y.contentID == x.conId) {
              reqData?.columnData.push({
                reportNo: y.reportNo,
                contentId: y.contentID,
                colAccount: false,
                colCutomerID: false,
                colCampaignName: false,
                colAdGroupName: false,
                colAdFinalURL: false,
                colHeadline: false,
                colHeadLine_1: false,
                colHeadLine_2: false,
                colDirections: false,
                colDirections_1: false,
                colDirections_2: false,
                colAdName: false,
                colSrchKeyWord: false,
                colConGoal: false,
                colConValue: false,
                colConByDate: false,
                colConPerCost: false,
                colCon: false,
                colConRate: false,
                colClicks: false,
                colImpressions: false,
                colCTR: false,
                colCPC: false,
                colCost: false,
                colAge: false,
                colGender: false,
                colConstant: false,
                colConAction: false,
                colCPA: false,
                colStartDate: false,
                colEndDate: false,
                isDelete: true,
              })
            }
          })
        });
        reqData?.columnData.forEach(x => {
          this.tmpDBReportColumn.forEach(y => {
            if (x.contentId == y.contentID) {
              x.reportNo = y.reportNo;
            }
          })
        })
      }
      //新增狀態下
      if (this.formType == "add") {
        this.columnArray.forEach(x => {
          if (x.conStatus == true) {
            reqData?.columnData.push({
              reportNo: 0,
              contentId: x.conId,
              colAccount: false,
              colCutomerID: false,
              colCampaignName: false,
              colAdGroupName: false,
              colAdFinalURL: false,
              colHeadline: false,
              colHeadLine_1: false,
              colHeadLine_2: false,
              colDirections: false,
              colDirections_1: false,
              colDirections_2: false,
              colAdName: false,
              colSrchKeyWord: false,
              colConGoal: false,
              colConValue: false,
              colConByDate: false,
              colConPerCost: false,
              colCon: false,
              colConRate: false,
              colClicks: false,
              colImpressions: false,
              colCTR: false,
              colCPC: false,
              colCost: false,
              colAge: false,
              colGender: false,
              colConstant: false,
              colConAction: false,
              colCPA: false,
              colStartDate: false,
              colEndDate: false,
              isDelete: false,
            })
          }
        });
      }

      //再來把屬於trueList 的寫入進去 false 的表示不顯示
      reqData.columnData.forEach(x => {
        this.columnArray.forEach(y => {
          if (x.contentId == y.conId) {
            console.log(x);
            y.TrueList.forEach(colSta => {
              switch (colSta.colName) {
                case columnMapping.colAccount:
                  x.colAccount = true;
                  break;
                case columnMapping.colCutomerID:
                  x.colCutomerID = true;
                  break;
                case columnMapping.colCampaignName:
                  x.colCampaignName = true;
                  break;
                case columnMapping.colAdGroupName:
                  x.colAdGroupName = true;
                  break;
                case columnMapping.colAdFinalURL:
                  x.colAdFinalURL = true;
                  break;
                case columnMapping.colHeadline:
                  x.colHeadline = true;
                  break;
                case columnMapping.colHeadLine_1:
                  x.colHeadLine_1 = true;
                  break;
                case columnMapping.colHeadLine_2:
                  x.colHeadLine_2 = true;
                  break;
                case columnMapping.colDirections:
                  x.colDirections = true;
                  break;
                case columnMapping.colDirections_1:
                  x.colDirections_1 = true;
                  break;
                case columnMapping.colDirections_2:
                  x.colDirections_2 = true;
                  break;
                case columnMapping.colAdName:
                  x.colAdName = true;
                  break;
                case columnMapping.colSrchKeyWord:
                  x.colSrchKeyWord = true;
                  break;
                case columnMapping.colConGoal:
                  x.colConGoal = true;
                  break;
                case columnMapping.colConValue:
                  x.colConValue = true;
                  break;
                case columnMapping.colConByDate:
                  x.colConByDate = true;
                  break;
                case columnMapping.colConPerCost:
                  x.colConPerCost = true;
                  break;
                case columnMapping.colCon:
                  x.colCon = true;
                  break;
                case columnMapping.colConRate:
                  x.colConRate = true;
                  break;
                case columnMapping.colClicks:
                  x.colClicks = true;
                  break;
                case columnMapping.colImpressions:
                  x.colImpressions = true;
                  break;
                case columnMapping.colCTR:
                  x.colCTR = true;
                  break;
                case columnMapping.colCpc:
                  x.colCPC = true;
                  break;
                case columnMapping.colCost:
                  x.colCost = true;
                  break;
                case columnMapping.colAge:
                  x.colAge = true;
                  break;
                case columnMapping.colGender:
                  x.colGender = true;
                  break;
                case columnMapping.colConstant:
                  x.colConstant = true;
                  break;
                case columnMapping.colConAction:
                  x.colConAction = true;
                  break;
                case columnMapping.colCPA:
                  x.colCPA = true;
                  break;
                // case columnMapping.colStartDate:
                //   x.colStartDate = true;
                //   break;
                // case columnMapping.colEndDate:
                //   x.colEndDate = true;
                //   break;
              }
            })
          }
        })
      })
      console.log(reqData);

      //#endregion
      return new Promise<void>((resolve) => {
        this.apiService.CallApi(path, 'POST', reqData).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            if (data.code == "200") {
              if (type == "edit") {
                console.log("編輯成功");
                this.dialogRef.close({ data: true, type: "edit" });
              } else {
                console.log("新增成功");
                this.dialogRef.close({ data: true, type: "add" });
              }
            }
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
          }
        });
      })
    }
  }
  /**取得報表明細(報表欄位_編輯用)API */
  async getReportDetail(id?: string) {
    try {
      const request = { columnID: `${id}` };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/ReportInfo/GetReportDetail`;
      console.log(qryDataUrl);
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            let repColList: repColListModel[];
            if (data.data) {
              let detailData = data.data as getReportDetailRes[];
              console.log(detailData);
              let colarray: repConModel[] = [];
              this.repContentList.forEach(x => {
                detailData.forEach(y => {
                  if (x.contentID == y.contentId) {
                    x.reportNo = y.reportNo;
                    x.status = true;
                    colarray.push(x)
                  }
                })
              })
              detailData.forEach(x => {
                repColList = [
                  { colName: columnMapping.colCampaignName, colStatus: x.isColCampaignName },
                  { colName: columnMapping.colAccount, colStatus: x.isColAccount },
                  { colName: columnMapping.colCutomerID, colStatus: x.isColCutomerID },
                  { colName: columnMapping.colCPA, colStatus: x.isColCPA },
                  { colName: columnMapping.colAdGroupName, colStatus: x.isColAdGroupName },
                  { colName: columnMapping.colAdFinalURL, colStatus: x.isColAdFinalURL },
                  { colName: columnMapping.colHeadline, colStatus: x.isColHeadline },
                  { colName: columnMapping.colHeadLine_1, colStatus: x.isColHeadLine_1 },
                  { colName: columnMapping.colHeadLine_2, colStatus: x.isColHeadLine_2 },
                  { colName: columnMapping.colDirections, colStatus: x.isColDirections },
                  { colName: columnMapping.colDirections_1, colStatus: x.isColDirections_1 },
                  { colName: columnMapping.colDirections_2, colStatus: x.isColDirections_2 },
                  { colName: columnMapping.colAdName, colStatus: x.isColAdName },
                  { colName: columnMapping.colSrchKeyWord, colStatus: x.isColSrchKeyWord },
                  { colName: columnMapping.colClicks, colStatus: x.isColClicks },
                  { colName: columnMapping.colImpressions, colStatus: x.isColImpressions },
                  { colName: columnMapping.colCTR, colStatus: x.isColCTR },
                  { colName: columnMapping.colCpc, colStatus: x.isColCPC },
                  { colName: columnMapping.colCost, colStatus: x.isColCost },
                  { colName: columnMapping.colAge, colStatus: x.isColAge },
                  { colName: columnMapping.colCon, colStatus: x.isColCon },
                  { colName: columnMapping.colConAction, colStatus: x.isColConAction },
                  { colName: columnMapping.colConGoal, colStatus: x.isColConByDate },
                  { colName: columnMapping.colConByDate, colStatus: x.isColConGoal },
                  { colName: columnMapping.colGender, colStatus: x.isColGender },
                  { colName: columnMapping.colConPerCost, colStatus: x.isColConPerCost },
                  { colName: columnMapping.colConRate, colStatus: x.isColConRate },
                  { colName: columnMapping.colConValue, colStatus: x.isColConValue },
                  { colName: columnMapping.colConstant, colStatus: x.isColConstant },
                  // { colName: columnMapping.colStartDate, colStatus: x.isColStartDate },
                  // { colName: columnMapping.colEndDate, colStatus: x.isColEndDate }
                ];
                var tList = repColList.filter(x => x.colStatus == true);
                var fList = repColList.filter(x => x.colStatus == false);
                colarray.forEach(y => {
                  this.columnArray.forEach(z => {
                    if (y.contentID == z.conId && x.contentId == y.contentID) {
                      z.conStatus = true;
                      z.TrueList = tList;
                      z.FalseList = fList;
                    }
                  })
                })
              })
              this.tmpDBReportColumn = colarray;
              this.myForm.controls.repContent.setValue(colarray);
            }
            this.loadingService.loadingOff();
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            this.loadingService.loadingOff();
            reject();
          }
        });
      }).then(response => {
        console.log(response);
      }).catch(e => {
        console.log(e);
      });
    }
    catch (e: any) {
      this.msgBoxService.msgBoxShow(e.toString());
    }
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
  async onOk(type: string): Promise<void> {
    /**todo 資料審核 */
    if (type == "edit") {
      await this.setReport('edit');
    } else if (type == "add") {
      await this.setReport('add');
    }
  }
  onCancel(): void {

    this.dialogRef.close({ data: false, type: this.formType });
  }
}
