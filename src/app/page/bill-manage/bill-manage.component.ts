import { data } from 'jquery';
import { Component, OnInit } from '@angular/core';
import { MessageService, SortEvent, SharedModule } from 'primeng/api';
import { BillDataList, BillDataModel, BillEditRequsetModel, BillRequsetModel } from './bill-manage.models';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/share/Models/share.model';
import { catchError, map, tap } from 'rxjs';
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from '../../share/loading/loading.component';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from 'src/app/share/service/api.service';
import { LoadingService } from 'src/app/share/service/loading.service';

@Component({
    selector: 'app-bill-manage',
    templateUrl: './bill-manage.component.html',
    styleUrls: ['./bill-manage.component.css'],
    standalone: true,
    imports: [MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, MatDatepickerModule, MatButtonModule, MatIconModule, TableModule, SharedModule, NgIf, NgFor, LoadingComponent, ToastModule, DatePipe]
})
export class BillManageComponent implements OnInit {
  constructor(private apiSvc: ApiService, public loadingService: LoadingService,
    private messageService: MessageService,) { }
  dataLsit: BillDataModel[] = [];
  clientName: string = "";
  subName: string = "";
  /**開始時間 */
  sD: string = "";
  /**結束時間 */
  eD: string = "";
  async ngOnInit(): Promise<void> {
    this.getBill();
  }
  async sortChange(sort: SortEvent): Promise<void> {
    sort.data.sort((data1: any, data2: any) => {
      let value1 = data1[sort.field];
      let value2 = data2[sort.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (sort.order * result);
    });
  }
  /**編輯按鈕 */
  onEdit(data: BillDataList) {
    data.isEdit = true;
  }
  /**儲存按鈕 */
  onSave(data: BillDataList) {
    let req: BillEditRequsetModel = {
      subNo: data.subNo,
      profit: parseInt(data.profit)
    }
    this.editBill(req);
    data.isEdit = false;
  }
  onCancel(data: BillDataList) {
    data.isEdit = false;
  }
  /**查詢按鈕 */
  async filterQry() {
    let reqData: BillRequsetModel = {
      clientName: this.clientName,
      subClientName: this.subName,
      clientStartDate: this.sD,
      clientEndDate: this.eD
    }
    this.getBill(reqData);
  }
  /**清除按鈕 */
  async cleanClick() {
    this.clientName = "";
    this.subName = "";
    this.sD = "";
    this.eD = "";
    this.getBill();
  }
  /**台幣轉換 */
  twFormat(coin: number): string {
    coin = coin / 1000000;
    const twFormat = new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    });
    let res = twFormat.format(+coin.toFixed(2));
    res = res.replace(/\.\d{2}$/, '');
    return res;
  }
  /**查詢帳單API */
  getBill(req?: BillRequsetModel) {
    const path = environment.apiServiceHost + `api/BillManagement/GetBillManagement`;
    this.loadingService.loadingOn();
    let request: BillRequsetModel = {
      clientName: req?.clientName ? req.clientName : "",
      subClientName: req?.subClientName ? req.subClientName : "",
      clientStartDate: req?.clientStartDate ? req.clientStartDate : "",
      clientEndDate: req?.clientEndDate ? req.clientEndDate : ""
    };
    this.apiSvc.CallApi(path, "POST", request).pipe(
      map((res: BaseResponse) => {
        let data = res.data as BillDataModel[];
        let i = 0;
        data.forEach(x => {
          x.index = `${i++}`
        })
        this.dataLsit = data;
      }),
      map(() => {
        this.dataLsit.forEach(x => {
          x.data.forEach(y => {
            y.accountBuget = this.twFormat(parseInt(y.accountBuget));
            y.realCost = this.twFormat(parseInt(y.realCost));
            y.reportCost = this.twFormat(parseInt(y.reportCost));
            y.isEdit = false;
          })
        })
        this.loadingService.loadingOff();
      }),
      catchError(async (err) => {
        this.messageService.add({ severity: 'error', summary: '失敗', detail: '修改帳單失敗!!' })
        this.loadingService.loadingOff();
      })
    ).subscribe();
  }

  /**編輯帳單API */
  editBill(req: BillEditRequsetModel) {
    const path = environment.apiServiceHost + `api/BillManagement/UpdateBillManagement`;
    let request: BillEditRequsetModel = {
      subNo: req.subNo,
      profit: req.profit
    };
    this.apiSvc.CallApi(path, "POST", request).pipe(
      map((res: BaseResponse) => {
        if (res.code == "200") {
          this.messageService.add({ severity: 'success', summary: '成功', detail: '修改帳單成功!!' });
          this.filterQry();
        } else {
          this.messageService.add({ severity: 'error', summary: '失敗', detail: `修改帳單失敗!!` });
        }
      }),
      catchError(async (err) => {
        this.messageService.add({ severity: 'error', summary: '失敗', detail: '修改帳單失敗!!' })
        this.loadingService.loadingOff();
      })
    ).subscribe();
  }
}
