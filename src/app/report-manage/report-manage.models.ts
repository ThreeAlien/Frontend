export interface exportSampleManageModels {
  /**帳戶活動名稱 */
  accActName: string;
  /**報表範本名稱 */
  exptSampleName: string;
  /**目標廣告 */
  goalAds: string;
  /**媒體類型 */
  mediaType: media;
  /**修改時間 */
  creatDt: string;
}
/**媒體類型 */
export enum media {
  Google="Google",
  FB="FB",
  IG="IG"
}
