import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, skipWhile, tap } from 'rxjs';
import { AccModel, MccModel } from 'src/app/page/report-manage/report-manage.models';
import { environment } from 'src/environments/environment';
import { BaseResponse, LoginInfoModel } from '../Models/share.model';
import { ApiService } from './api.service';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
/**常用方法 */
export class CommonService {

  constructor(public apiService: ApiService,private msgSvc: MessageService,) { }
  /**客戶資料 */
  newAccItemData!: AccModel[];
  AccItemListSub: BehaviorSubject<AccModel[]> = new BehaviorSubject<AccModel[]>(this.newAccItemData);
  AccItemList$: Observable<AccModel[]> = this.AccItemListSub.asObservable();

  /**子帳戶活動資料 */
  newChildMccItemData!: MccModel[];
  ChildMccItemListSub: BehaviorSubject<MccModel[]> = new BehaviorSubject<MccModel[]>(this.newChildMccItemData);
  ChildMccItemList$: Observable<MccModel[]> = this.ChildMccItemListSub.asObservable();

  /**客戶名稱API */
  async getClinetName() {
    const request = { clientId: "" };
    let rD = JSON.stringify(request);
    const path = environment.apiServiceHost + `api/CustomerInfo/GetCustomer`;
    return this.apiService.CallApi(path, 'POST', rD).pipe(
      map(res => res && res.data ? res.data : []),
      tap((data: AccModel[]) => this.AccItemListSub.next(data)),
      catchError(async (err) => {
        this.msgSvc.add({ severity: 'error', summary: '錯誤', detail: '客戶名稱未知錯誤!' });
      })
    )
  }
  /**子帳戶活動名稱 API*/
  getChildName() {
    const path = environment.apiServiceHost + `api/SubClient/GetSubClient`;
    return this.apiService.CallApi(path, 'POST', {}).pipe(
      map(res => res && res.data ? res.data : []),
      tap((data: MccModel[]) => this.ChildMccItemListSub.next(data)),
      catchError(async (err) => {
        this.msgSvc.add({ severity: 'error', summary: '錯誤', detail: '子帳戶活動名稱未知錯誤!' })
      })
    )
  }
  /**
   * 訂閱客戶(使用資料)
   * @returns
   */
  AccItemList(): Observable<AccModel[]> {
    return this.AccItemList$.pipe(skipWhile((data) => !data));
  }

  /**
   * 訂閱子帳戶活動(使用資料)
   * @returns
   */
  ChildMccItemList(): Observable<MccModel[]> {
    return this.ChildMccItemList$.pipe(skipWhile((data) => !data));
  }
}
