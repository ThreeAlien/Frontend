import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**常用方法 */
export class CommonService {

  constructor() { }
  /**客戶資料 */
  AccItemListSub: BehaviorSubject<AccModel[]> = new BehaviorSubject<AccModel[]>(null);
  AccItemList$ : Observable<AccModel[]> = this.AccItemListSub.asObservable();

  /**子帳戶活動資料 */
  ChildMccItemListSub: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  ChildMccItemList$ : Observable<any> = this.ChildMccItemListSub.asObservable();
  
  /**客戶名稱API */
  async getClinetName() {
    try {
      const request = { clientId: "" };
      let rD = JSON.stringify(request);
      const path = environment.apiServiceHost + `api/CustomerInfo/GetCustomer`;
      return new Promise<void>((resolve) => {
        this.apiService.CallApi(path, 'POST', rD).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            if (data.data) {
              data.data as AccModel[];
              this.AccItemListSub.next(data.data);
            }
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
          }
        });
      })
    }
    catch (e: any) {
      this.msgBoxService.msgBoxShow(e.toString());
    }
  }
  /**
   * 訂閱客戶(使用資料)
   * @returns
   */
  AccItemList(): Observable<LoginInfoModel> {
    return this.AccItemList$.pipe(skipWhile((data) => !data));
  }

  /**
   * 訂閱子帳戶活動(使用資料)
   * @returns
   */
  ChildMccItemList(): Observable<LoginInfoModel> {
    return this.ChildMccItemList$.pipe(skipWhile((data) => !data));
  }
}