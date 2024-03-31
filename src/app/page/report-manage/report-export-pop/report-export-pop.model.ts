export interface ExportReportModel{
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
  kwAdGroupName = "廣告群組",
  kwCampaignName = "廣告活動",
  kwColSrchKeyWord = "搜尋字詞",
  impression = "曝光數",
  date="日期",
  click = "點擊數",
  cost = "費用",
  cpc = "CPC",
  ctr = "點閱率"
}
export interface exportData{
  date:string;
  adGroupName:string;
  campaignName:string;
  colSrchKeyWord :string;
  location:string;
  age:string;
  click:number;
  cost:number;
  cpc:number;
  ctr:string;
  gender:string;
  impressions:number;
}
