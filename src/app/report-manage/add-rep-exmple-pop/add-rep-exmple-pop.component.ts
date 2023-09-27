import { data } from 'jquery';
import { ApiService } from './../../service/api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccModel, BaseResponse, exportSampleManageModels } from '../report-manage.models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { environment } from 'src/environments/environment';
import { MsgBoxService } from 'src/app/service/msg-box.service';
import { MsgBoxInfo } from 'src/app/share/msg-box/msg-box.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-rep-exmple-pop',
  templateUrl: './add-rep-exmple-pop.component.html',
  styleUrls: ['./add-rep-exmple-pop.component.css'],
})
/**新增報表範本 */
export class AddRepExmplePopComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AddRepExmplePopComponent>,
    @Inject(MAT_DIALOG_DATA) public inPutdata: exportSampleManageModels,
    public apiService: ApiService,
    private msgBoxService: MsgBoxService) { }
  //#region 資料宣告

  mediaType = "";
  mediaG = "G";
  mediaM = "M"
  /**範本名稱 */
  repExmName = "";
  /**目標廣告 */
  targetMedia = "";
  /**客戶名稱下拉選單 */
  AccItem: any;
  AccItemList: AccModel[] = [];
  /**帳戶名稱(MCC)下拉選單 */
  MccItem: any;
  MccItemList = [
    { value: '01', viewValue: 'Vanguard_Nike' },
    { value: '02', viewValue: 'Vanguard_勤大德滙' },
    { value: '03', viewValue: 'Vanguard_Puma' },
    { value: '04', viewValue: 'Vanguard_家樂福' },
    { value: '05', viewValue: 'Vanguard_PcHome24h' },
    { value: '06', viewValue: 'Vanguard_汎古' }
  ];
  /**子帳戶名稱下拉選單 */
  ChildAccItem: any;
  ChildAccItemList = [
    { value: '01', viewValue: 'Nike_襪子_A', targetM: "A" },
    { value: '02', viewValue: 'Nike_衣服_B', targetM: "B" },
    { value: '03', viewValue: 'Nike_褲子_C', targetM: "C" },
    { value: '04', viewValue: 'Nike_鞋子_D', targetM: "D" },
    { value: '05', viewValue: 'Nike_外套_E', targetM: "E" },
    { value: '06', viewValue: 'Nike_後背包_F', targetM: "F" }
  ];
  /**子帳戶名稱下拉選單 */
  reportContent: any;
  reportContentList = [
    { value: '01', viewValue: '每日報表', targetM: "A" },
    { value: '02', viewValue: '每週報表', targetM: "B" },
    { value: '03', viewValue: '廣告活動成效', targetM: "C" },
    { value: '04', viewValue: '廣告群組成效', targetM: "D" },
    { value: '05', viewValue: '年齡成效', targetM: "E" },
    { value: '06', viewValue: '地區成效', targetM: "F" },
    { value: '06', viewValue: '性別成效', targetM: "F" },
    { value: '06', viewValue: '每日報表/轉換', targetM: "F" },
  ];
  /**報表欄位下拉選單 */
  col: any = "123";
  colList = [
    { value: '01', viewValue: '週期', targetM: "" },
    { value: '02', viewValue: '廣告活動', targetM: "" },
    { value: '03', viewValue: '年齡區間', targetM: "" },
    { value: '04', viewValue: '性別', targetM: "" },
    { value: '05', viewValue: '地區', targetM: "" },
    { value: '06', viewValue: '廣告群組', targetM: "" }
  ];
  column = [
    { name: '日期' },
    { name: '曝光數' },
    { name: '點擊數' },
    { name: '點閱率(CTR)' },
    { name: '點擊成本(CPC)' },
    { name: '費用(未)' },
  ];
  msgData = new MsgBoxInfo;
  //#endregion

  async ngOnInit(): Promise<void> {
    this.mediaType = "";
    await this.getClinetName();
  }
  changeFormType(value: string) {
    this.mediaType = value;
  }
  /**選擇客戶名稱 */
  changeAcc(data: any): void {
    console.log(data.value);
    this.ChildAccItemList = [];
    switch (data.value) {
      case "pc":
        this.ChildAccItemList.push(
          { value: '01', viewValue: 'PcHome24h_家電_A', targetM: "A" },
          { value: '01', viewValue: 'PcHome24h_電腦_B', targetM: "B" },
          { value: '01', viewValue: 'PcHome24h_主機_C', targetM: "C" },
          { value: '01', viewValue: 'PcHome24h_民生用品_D', targetM: "D" },
          { value: '01', viewValue: 'PcHome24h_藥品_E', targetM: "E" },
          { value: '01', viewValue: 'PcHome24h_3C_F', targetM: "F" },
        )
        break;
      case "nike":
        this.ChildAccItemList.push(
          { value: '01', viewValue: 'Nike_襪子_A', targetM: "A" },
          { value: '02', viewValue: 'Nike_衣服_B', targetM: "B" },
          { value: '03', viewValue: 'Nike_褲子_C', targetM: "C" },
          { value: '04', viewValue: 'Nike_鞋子_D', targetM: "D" },
          { value: '05', viewValue: 'Nike_外套_E', targetM: "E" },
          { value: '06', viewValue: 'Nike_後背包_B', targetM: "B" }
        )
        break;
    }
  }
  /**選擇子帳戶 */
  changeChilAcc(data: any): void {
    console.log(data);
    switch (data.targetM) {
      case "A":
        this.targetMedia = "搜尋廣告";
        break;
      case "B":
        this.targetMedia = "多媒體廣告";
        break;
      case "C":
        this.targetMedia = "影音廣告";
        break;
      case "D":
        this.targetMedia = "購物廣告";
        break;
      case "E":
        this.targetMedia = "最高成效廣告";
        break;
      case "F":
        this.targetMedia = "搜尋廣告";
        break;
    }
  }
  /**欄位拖移 */
  drop(event: CdkDragDrop<[]>) {
    console.log(event);
    moveItemInArray(this.column, event.previousIndex, event.currentIndex);
    console.log(this.column);
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
    var itemIndex = this.column.findIndex(x => x.name == data.name);
    this.column.splice(itemIndex, 1);
    console.log(this.column);
  }
  //#region API事件
  /**客戶名稱API */
  async getClinetName() {
    try {

      const qryDataUrl = environment.apiServiceHost + `api/Customer`;
      console.log(qryDataUrl);
      this.apiService.CallApi(qryDataUrl, 'GET', { BaseResponse }).subscribe({
          next:(res)=> {
            var data =  res as BaseResponse;
            //console.log(a.data);
            if (data) {
              data.data.forEach((x:AccModel) => {
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
  async getChildName(name:string){
    try {
      this.msgData = new MsgBoxInfo;
      const qryDataUrl = environment.apiServiceHost + `api/Customer`;
      console.log(qryDataUrl);
      this.apiService.CallApi(qryDataUrl, 'GET', { BaseResponse }).subscribe({
          next:(res)=> {
            var data =  res as BaseResponse;

            if (data) {
              data.data.forEach((x:AccModel) => {
                this.AccItemList.push(x);
              });
              console.log(this.AccItemList);
            }else{
              var data =  res as BaseResponse;
              this.msgData.title = `回應碼${data.code}`
              this.msgBoxService.msgBoxShow()
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
    this.dialogRef.close({ data: false });
  }
  onCancel(): void {
    this.dialogRef.close({ data: false });
  }
}
