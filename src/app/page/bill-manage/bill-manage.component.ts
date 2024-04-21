import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';
import { BillDataModel, BillRequsetModel } from './bill-manage.models';
import { ApiService } from 'src/app/service/api.service';
import { environment } from 'src/environments/environment';
import { BaseResponse } from 'src/app/share/Models/share.model';
import { catchError, map, tap } from 'rxjs';

@Component({
  selector: 'app-bill-manage',
  templateUrl: './bill-manage.component.html',
  styleUrls: ['./bill-manage.component.css']
})
export class BillManageComponent implements OnInit {
  constructor(private apiSvc: ApiService) { }
  dataLsit: BillDataModel[] = [
    { clientName: "Nike", subName: "Nike_襪子特賣_KW", mediaType: "google", budget: "10000", profit: "5%", sDT: "2024/01/01", eDT: "2024/03/01", reportCost: "10000", realCost: "5000", isEdit: false },
    { clientName: "Nike", subName: "Nike_鞋子子特賣_KW", mediaType: "google", budget: "20000", profit: "2%", sDT: "2024/01/01", eDT: "2024/03/01", reportCost: "10000", realCost: "5000", isEdit: false },
    { clientName: "Nike", subName: "Nike_內褲特賣_KW", mediaType: "google", budget: "50000", profit: "3%", sDT: "2024/01/01", eDT: "2024/03/01", reportCost: "10000", realCost: "5000", isEdit: false },
    { clientName: "Nike", subName: "Nike_衣服特賣_KW", mediaType: "google", budget: "2300", profit: "1%", sDT: "2024/01/01", eDT: "2024/03/01", reportCost: "10000", realCost: "5000", isEdit: false },
    { clientName: "Nike", subName: "Nike_帽子特賣_KW", mediaType: "google", budget: "45600", profit: "3%", sDT: "2024/01/01", eDT: "2024/03/01", reportCost: "10000", realCost: "5000", isEdit: false },
    { clientName: "Nike", subName: "Nike_外套特賣_KW", mediaType: "google", budget: "80000", profit: "4%", sDT: "2024/01/01", eDT: "2024/03/01", reportCost: "10000", realCost: "5000", isEdit: false },
  ];

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
  onEdit(status: BillDataModel) {
    status.isEdit = true;
  }
  onSave(status: BillDataModel) {
    status.isEdit = false;
  }
  onCancel(status: BillDataModel) {
    status.isEdit = false;
  }
  getBill() {
    const path = environment.apiServiceHost + `api/BillManagement/GetBillManagement`;
    let request: BillRequsetModel = {
      clientName: '',
      subClientName: '',
      clientStartDate: '',
      clientEndDate: ''
    };
    this.apiSvc.CallApi(path, "POST", request).pipe(
      map((res: BaseResponse) => {
        console.log(res);
      }),
      catchError(async (err) => console.log(err))
    ).subscribe();
    // return new Promise<void>((resolve) => {
    //   this.apiSvc.CallApi(path, 'POST', request).subscribe({

    //   })
    // })
  }
}
