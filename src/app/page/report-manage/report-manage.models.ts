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
export interface exportSampleManageModelsTest {
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
  status: boolean;
}
/**欄位名稱 */
export interface columnModel {
  contentId: string,
  contentName: string,
  columnId: null,
  isColAccount: boolean,
  isColCutomerID: boolean,
  isColCampaignName: boolean,
  isColAdGroupName: boolean,
  isColAdFinalURL: boolean,
  isColHeadline: boolean,
  isColShortHeadLine: boolean,
  isColLongHeadLine: boolean,
  isColHeadLine_1: boolean,
  isColHeadLine_2: boolean,
  isColDirections: boolean,
  isColDirections_1: boolean,
  isColDirections_2: boolean,
  isColAdName: boolean,
  isColAdPath_1: boolean,
  isColAdPath_2: boolean,
  isColSrchKeyWord: boolean,
  isColSwitchTarget: boolean,
  isColDateTime: boolean,
  isColWeek: boolean,
  isColSeason: boolean,
  isColMonth: boolean,
  isColIncome: boolean,
  isColTransTime: boolean,
  isColTransCostOnce: boolean,
  isColTrans: boolean,
  isColTransRate: boolean,
  isColClick: boolean,
  isColImpression: boolean,
  isColCTR: boolean,
  isColCPC: boolean,
  isColCost: boolean,
  isColAge: boolean,
  isColSex: boolean,
  isColRegion: boolean,
  contentSort: string
}
/**目標廣告對照表 */
export enum targetMapping {
  glgSem = "搜尋廣告",
  glgGdn = "多媒體廣告",
  glgYt = "影音廣告",
  glgShop = "購物廣告",
  glgPmas = "最高成效廣告",
  glgKw = "關鍵字廣告"
}
/**欄位對照表 */
export enum columnMapping {
  colCampaignName = "廣告活動",
  colAdgroupName = "廣告群組",
  colAdfinalURL = "最終到達網址",
  colHeadline = "標題",
  colShortheadline = "短標題",
  colLongheadline = "長標題",
  colHeadline_1 = "廣告標題 1",
  colheadline_2 = "廣告標題 2",
  colDirections = "說明",
  colDirections_1 = "說明 2",
  colDirections_2 = '說明 3',
  colAdName = "廣告名稱",
  colAdPath_1 = "路徑 1",
  colAdPath_2 = "路徑 2",
  colSrchKeyWord = "搜尋關鍵字",
  colSwitchTarget = "轉換目標",
  colDatetime = "日期",
  colWeek = "週",
  colSeason = "季",
  colMonth = "月",
  colIncome = "收益",
  colTransTime = "轉換 (依轉換時間)",
  colTransCostOnce = "單次轉換費用",
  colTrans = "轉換",
  colTransRate = "轉換率",
  colClick = "點擊",
  colImpression = "曝光",
  colCtr = "點擊率(CTR)",
  colCpc = "點擊成本(CPC)",
  colCost = "費用",
  colAge = "年齡",
  colSex = "性別",
  colRegion = "範圍",
}
export class repColModel {
  /** */
  public conId!: string;
  /** */
  public conName!: string;
  /** */
  public conStatus!: boolean;
  /**有被選到的欄位 */
  public TrueList: Array<repColListModel> = [];
  /**未選到的欄位 */
  public FalseList: Array<repColListModel> = [];
}
export class repColListModel {
  public colName!: string;
  public colStatus!: boolean;
}
