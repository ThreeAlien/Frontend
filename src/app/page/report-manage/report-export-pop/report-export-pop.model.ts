import { ThemePalette } from "@angular/material/core";

export interface ExportReportData {
  /**子帳戶活動ID */
  subId: string;
  /**子帳戶活動名稱 */
  subName: string;
  ExportReportData: ExportReportModel[];
}
export interface ExportReportModel{
  /**子帳戶活動Id */
  subId:string;
  /**報表名稱 */
  reportName:string;
  /**HTMLID 標籤用 */
  tableId:string;
  /**欄位名稱 */
  colNameList:colThModel[]
  /**欄位值 */
  colValueList:colValueModel[]
  /**總計 */
  totalList:colModel[]
}
export interface colValueModel{
  tdList:colModel[]
}
export interface colModel{
  colValue:any;
  colSta:boolean
}
export interface colThModel{
  colValue:any;
  colSta:boolean;
  width:string;
}
export enum colMapping{
  genderTitie = "性別區間",
  genderMale = "男性",
  genderFemale = "女性",
  genderUnknow = "未知",
  ageTitle = "年齡區間",
  locationTitle = "地區成效",
  AdGroupName = "廣告群組",
  CampaignName = "廣告活動",
  kwColSrchKeyWord = "搜尋字詞",
  matchType = "搜尋關鍵字比對類型",
  impression = "曝光數",
  date="日期",
  click = "點擊數",
  cost = "費用",
  cpc = "CPC",
  ctr = "點閱率"
}
export enum reportNameMapping{
  genderRepName = "#性別成效",
  ageRepName = "#年齡成效",
  dayRepName = "#每日報表",
  weekRepName = "#每週報表",
  kwRepName = "#曝光前十大關鍵字成效",
  locationRepName = "#地區成效",
  CampaignRepName = "#廣告活動成效",
  AdGroupRepName = "#廣告群組成效",
}
export class exportDataList {
  /**是否被勾選 */
  sta!: boolean;
  /**報表ID */
  Id!: number;
  /**報表ID */
  contentId!:string;
  /**報表名稱 */
  reportName!: string;
  /**開始時間 */
  SD!: string;
  /**結束時間 */
  ED!: string;
  /**報表日期區間篩選 */
  dateRangePickList: dateRangeModel[] = [];
}
export interface dateRangeModel {
  name: string;
  value: string;
}
export interface exportData{
  subId:string;
  date:string;
  adGroupName:string;
  campaignName:string;
  colSrchKeyWord :string;
  matchType:string,
  location:string;
  age:string;
  click:number;
  cost:number;
  cpc:number;
  ctr:string;
  gender:string;
  impressions:number;
}
/**帳戶活動名稱 */
export interface MccModel {
  /**客戶ID */
  clientId: string;
  /**子帳戶ID */
  subId: string;
  /**子帳戶名稱 */
  subName: string;
}
/**chkBox */
export interface subChkBoxModel {
  name: string;
  isCheck: boolean;
  color: ThemePalette;
  subChkBox: exportSubListModel[];
}
export interface exportSubListModel {
  isCheck: boolean;
  subId: string;
  subName: string;
  color: ThemePalette;
}
