export interface BillDataModel {
  /**客戶名稱 */
  clientName?: string;
  /**子帳戶活動名稱 */
  subName: string;
  /**媒體種類 */
  mediaType: string;
  /**帳戶預算 */
  budget:string;
  /**利潤% */
  profit: string;
  /**開始日期*/
  sDT?: string;
  /**結束日期 */
  eDT?: string;
  /**報表費用 */
  reportCost?: string;
  /**客戶實際花費 */
  realCost?: string;
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
  clientEndDate:string;
}
