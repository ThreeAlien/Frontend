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
  public id!: string;
  /**使用者名稱 */
  public name!: string;
}
