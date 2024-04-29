export interface BillDataModel {
  index:string;
  /**客戶名稱 */
  clientName?: string;
  /**子帳戶活動名稱 */
  data: BillDataList[];
}
export interface BillDataList {
  /**子帳戶ID */
  subNo:number;
  /**客戶名稱 */
  clientName?: string;
  /**子帳戶活動名稱 */
  subClientName: string;
  /**媒體種類 */
  mediaType: string;
  /**帳戶預算 */
  accountBuget: string;
  /**利潤% */
  profit: string;
  /**開始日期*/
  budgetStartDate?: string;
  /**結束日期 */
  budgetEndDate?: string;
  /**報表費用 */
  reportCost?: string;
  /**客戶實際花費 */
  realCost: string;
  /**是否編輯 */
  isEdit: boolean;
}
export interface BillRequsetModel {
  /**客戶名稱 */
  clientName: string;
  /**子帳戶活動名稱 */
  subClientName: string;
  /**開始時間 */
  clientStartDate: string;
  /**結束時間 */
  clientEndDate: string;
}
export interface BillEditRequsetModel {
  /**客戶名稱 */
  subNo: number;
  /**預算 */
  profit: number;
}
