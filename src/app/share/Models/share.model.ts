export class BaseResponse {
  /**回應碼 */
  public code: string | undefined;
  /**資料 */
  public data: any;
  /**訊息 */
  public msg: string | undefined;
}
export class LoginInfoModel{
  /**使用者ID */
  public userId!: string;
  /**使用者名稱 */
  public userName!: string;
  /**使用者階級 */
  public userLv!:string;
}
