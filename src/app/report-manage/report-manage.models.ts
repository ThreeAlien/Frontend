import { core } from "@angular/compiler";

export interface exportSampleManageModels {
  /**範本報表ID */
  report_id: string;
  /**報表範本名稱 */
  report_name: string;
  /**子帳戶名稱 */
  client_subname: string;
  /**目標廣告 */
  report_goalads: string;
  /**媒體類型 */
  report_media: string;
  /**欄位ID */
  column_id: string;
  /**創建者 */
  creat_cname: string;
  /**創建時間 */
  creat_date: string;
  /**編輯者 */
  edit_cname: string;
  /**編輯時間 */
  edit_date: string;
  /**報表狀態1/0 */
  report_status: string;
  /**子帳戶ID */
  sub_id: string;
}
export interface exportSampleManageModelsTest{
  /**報表範本名稱 */
  exptSampleName: string;
  /**子帳戶名稱 */
  accActName: string;
  /**目標廣告 */
  goalAds: string;
  /**媒體類型 */
  mediaType: string;
  /**創建時間 */
  creatDt: string;
}
/**媒體類型 */
export enum media {
  Google = "Google",
  FB = "FB",
  IG = "IG"
}
export class BaseResponse {
  /**回應碼 */
  public code: string | undefined;
  /**資料 */
  public data: any;
  /**訊息 */
  public msg: string | undefined;

}
/**帳戶名稱 */
export interface AccModel {
  /**客戶ID */
  clientId: string;
  /**客戶名稱 */
  clientName: string;
}
/**帳戶活動名稱 */
export interface MccModel {
  /**客戶ID */
  clientId: string;
  /**子帳戶名稱 */
  subName: string;
}
/**目標廣告 */
export interface targetMediaModel {
  /**代號 */
  tMedia_id: string;
  /**目標廣告名稱 */
  tMedia_name: targetMapping;
}


/**報表內容 */
export interface repConModel {
  /**報表內容ID */
  contentID: string;
  /**報表內容名稱 */
  contentName: string;
  /**狀態是否選用 */
  status:boolean;
}
/**欄位名稱 */
export interface columnModel {
  content_id: string,
  column_id: string,
  content_name: string,
  column_sort: string,
  col_account: string,
  col_cutomerID: string,
  col_campaignID: string,
  col_adgroupID: string,
  col_adfinalURL: string,
  col_headline: string,
  col_shortheadline: string,
  col_longheadline: string,
  col_headline_1: string,
  col_headline_2: string,
  col_directions: string,
  col_directions_1: string,
  col_directions_2: string,
  col_adName: string,
  col_adPath_1: string,
  col_adPath_2: string,
  col_srchKeyWord: string,
  col_switchTarget: string,
  col_datetime: string,
  col_week: string,
  col_season: string,
  col_month: string,
  col_income: string,
  col_trans_time: string,
  col_trans_cost_once: string,
  col_trans: string,
  col_trans_rate: string,
  col_click: string,
  col_impression: string,
  col_ctr: string,
  col_cpc: string,
  col_cost: string,
  col_age: string,
  col_sex: string,
  col_region: string,
}
/**目標廣告對照表 */
export enum targetMapping {
  glg_sem = "搜尋廣告",
  glg_gdn = "多媒體廣告",
  glg_yt = "影音廣告",
  glg_shop = "購物廣告",
  glg_pmas = "最高成效廣告"
}
/**欄位對照表 */
export enum columnMapping {
  col_campaignID = "廣告活動",
  col_adgroupID = "廣告群組",
  col_adfinalURL = "最終到達網址",
  col_headline = "標題",
  col_shortheadline = "短標題",
  col_longheadline = "長標題",
  col_headline_1 = "廣告標題 1",
  col_headline_2 = "廣告標題 2",
  col_directions = "說明",
  col_directions_1 = "說明 2",
  col_directions_2 = "說明 3",
  col_adName = "廣告名稱",
  col_adPath_1 = "路徑 1",
  col_adPath_2 = "路徑 2",
  col_srchKeyWord = "搜尋關鍵字",
  col_switchTarget = "轉換目標",
  col_datetime = "日期",
  col_week = "週",
  col_season = "季",
  col_month = "月",
  col_income = "收益",
  col_trans_time = "轉換 (依轉換時間)",
  col_trans_cost_once = "單次轉換費用",
  col_trans = "轉換",
  col_trans_rate = "轉換率",
  col_click = "點擊",
  col_impression = "曝光",
  col_ctr = "點擊率(CTR)",
  col_cpc = "點擊成本(CPC)",
  col_cost = "費用",
  col_age = "年齡",
  col_sex = "性別",
  col_region = "範圍",
}
export class repColModel{
  /** */
  public id: string | undefined;
  /** */
  public name: any;
  /** */
  public List:Array<repColListModel>= [];
}
export class repColListModel{
   /** */
   public coltype: string | undefined;
   /** */
   public name: any;
   /** */
   public status: string | undefined;
}
