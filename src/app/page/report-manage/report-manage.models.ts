export class exportSampleModels {
  /**客戶ID */
  clienId!:string;
  /**範本報表ID */
  reportID!: string;
  /**報表範本名稱 */
  reportName!: string;
  /**子帳戶名稱*/
  subClientName!: string;
  /**目標廣告 */
  reportGoalAds!: string;
  /**媒體類型 */
  reportMedia!: string;
  /**報表內容ID */
  columnID!: string;
  /**創建者 */
  creater!: string;
  /**創建時間 */
  createDate!: string;
  /**編輯者 */
  editer!: string;
  /**編輯時間 */
  editDate!: string;
  /**報表狀態1/0 */
  reportStatus!: string;
  /**客戶子帳戶ID */
  subID!: string;
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
/**帳戶名稱 */
export interface AccModel {
  /**客戶ID */
  clientId: string;
  /**客戶名稱 */
  clientName: string;
  /**客戶狀態 */
  clientStatus: boolean;
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
/**目標廣告 */
export interface reportGoalAdsModel {
  /**代號 */
  goalId: string;
  /**目標廣告名稱 */
  goalName: GoalAdsMapping;
}


/**報表內容 */
export interface repConModel {
  reportNo:number;
  /**報表內容ID */
  contentID: string;
  /**報表內容名稱 */
  contentName: string;
  /**狀態是否選用 */
  status: boolean;
  /**是否啟用 */
  enable:boolean;
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
  isColHeadLine_1: boolean,
  isColHeadLine_2: boolean,
  isColDirections: boolean,
  isColDirections_1: boolean,
  isColDirections_2: boolean,
  isColAdName: boolean,
  isColSrchKeyWord: boolean,
  isColClicks: boolean,
  isColImpressions: boolean,
  isColCTR: boolean,
  isColCPC: boolean,
  isColCost: boolean,
  isColAge: boolean,
  isColCPA: boolean;
  isColCon: boolean;
  isColConAction: boolean;
  isColConByDate: boolean;
  isColConGoal: boolean;
  isColConPerCost: boolean;
  isColConRate: boolean;
  isColConValue: boolean;
  isColConstant: boolean;
  isColEndDate: boolean;
  isColGender: boolean;
  isColStartDate: boolean;
  contentSort: string
}
/**目標廣告對照表 */
export enum GoalAdsMapping {
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
  colCutomerID = "客戶ID",
  colAccount = "帳戶名稱",
  colAdGroupName = "廣告群組",
  colAdFinalURL = "最終到達網址",
  colHeadline = "標題",
  colHeadLine_1 = "廣告標題1",
  colHeadLine_2 = "廣告標題2",
  colDirections = "說明",
  colDirections_1 = "說明2",
  colDirections_2 = '說明3',
  colAdName = "廣告名稱",
  colSrchKeyWord = "搜尋關鍵字",
  colClicks = "點擊",
  colImpressions = "曝光",
  colCTR = "點擊率(CTR)",
  colCpc = "點擊成本(CPC)",
  colCost = "費用",
  colAge = "年齡",
  colCPA = "CPA",
  colCon = "轉換",
  colConAction = "轉換動作",
  colConByDate = "轉換 (依轉換時間)",
  colConGoal = "轉換目標",
  colConPerCost = "單次轉換費用",
  colConRate = "轉換率",
  colConValue = "收益",
  colConstant = "地區",
  // colStartDate = "開始日期",
  // colEndDate = "結束日期",
  colGender = "性別"
}
export class repColModel {
  /**報表ID */
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
/**取得報表範本Request */
export class GetReportRequest {
  /**報表範本名稱 */
  reportName!: string;
  /**目標廣告 */
  reportGoalAds!: string;
  /**媒體選項 */
  reportMedia!: string;
  /**開始時間 */
  startDate!: string;
  /**結束時間 */
  endDate!: string;
  /**使用者ID */
  userId!:string;
}
export class setReportRequest {
  reportId?: string;
  columnID!: string;
  reportName!: string;
  /**目標廣告 */
  reportGoalAds!: string;
  /**媒體選項 */
  reportMedia!: string;
  editer!:string;
  editDate: Date | undefined;
  subID!: string;
  creater!: string;
  createDate: Date | undefined;
  reportStatus!: boolean;
  columnData!: columnDataReq[];
}
export class columnDataReq {
  reportNo!:number;
  colAccount!: boolean;
  colCutomerID!: boolean;
  colCampaignName!: boolean;
  colAdGroupName!: boolean;
  colAdFinalURL!: boolean;
  colHeadline!: boolean;
  colHeadLine_1!: boolean;
  colHeadLine_2!: boolean;
  colDirections!: boolean;
  colDirections_1!: boolean;
  colDirections_2!: boolean;
  colAdName!: boolean;
  colSrchKeyWord!: boolean;
  colConGoal!: boolean;
  colConValue!: boolean;
  colConByDate!: boolean;
  colConPerCost!: boolean;
  colCon!: boolean;
  colConRate!: boolean;
  colClicks!: boolean;
  colImpressions!: boolean;
  colCTR!: boolean;
  colCPC!: boolean;
  colCost!: boolean;
  contentId!: string;
  colAge!: boolean;
  colGender!: boolean;
  colConstant!: boolean;
  colConAction!: boolean;
  colCPA!: boolean;
  colStartDate!: boolean;
  colEndDate!: boolean;
  isDelete!: boolean;
}
export class getReportDetailRes{
  reportNo!: number;
  contentName:string="";
  contentId:string="";
  columnId:string="";
  isColAccount: boolean = false;
  isColCutomerID: boolean = false;
  isColCampaignName: boolean = false;
  isColAdGroupName: boolean = false;
  isColAdFinalURL: boolean = false;
  isColHeadline: boolean = false;
  isColHeadLine_1: boolean = false;
  isColHeadLine_2: boolean = false;
  isColDirections: boolean = false;
  isColDirections_1: boolean = false;
  isColDirections_2: boolean = false;
  isColAdName: boolean = false;
  isColSrchKeyWord: boolean = false;
  isColConGoal: boolean = false;
  isColConValue: boolean = false;
  isColConByDate: boolean = false;
  isColConPerCost: boolean = false;
  isColCon: boolean = false;
  isColConRate: boolean = false;
  isColClicks: boolean = false;
  isColImpressions: boolean = false;
  isColCTR: boolean = false;
  isColCPC: boolean = false;
  isColCost: boolean = false;
  isColAge: boolean = false;
  isColGender: boolean = false;
  isColConstant: boolean = false;
  isColConAction: boolean = false;
  isColCPA: boolean = false;
  isColStartDate: boolean = false;
  isColEndDate: boolean = false;
  contentSort!:null;
  isDefault!:null;
}
