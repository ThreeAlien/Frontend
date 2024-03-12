export class BaseResponse {
  /**回應碼 */
  public code: string | undefined;
  /**資料 */
  public data: any;
  /**訊息 */
  public msg: string | undefined;
}
