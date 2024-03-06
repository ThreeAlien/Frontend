import { Component, OnInit } from '@angular/core';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-client-manage',
  templateUrl: './client-manage.component.html',
  styleUrls: ['./client-manage.component.css']
})
export class ClientManageComponent implements OnInit {
  constructor() { }
  dataLsit: DataModel[] = [
    { clientName: "Nike", media: "FB", mediaType: "多媒體廣告", profit: "5%", sDT: "2023/01/02", eDT: "2023/05/06", expectCost: "10000", realCost: "5000", isEdit: false },
    { clientName: "家樂福", media: "Google", mediaType: "多媒體廣告", profit: "6%", sDT: "2023/01/02", eDT: "2023/05/06", expectCost: "75489", realCost: "60000", isEdit: false },
    { clientName: "好事多", media: "FB", mediaType: "多媒體廣告", profit: "7%", sDT: "2023/01/02", eDT: "2023/05/06", expectCost: "31000", realCost: "20000", isEdit: false },
    { clientName: "好事多", media: "FB", mediaType: "多媒體廣告", profit: "7%", sDT: "2023/01/02", eDT: "2023/05/06", expectCost: "31000", realCost: "20000", isEdit: false },
    { clientName: "好事多", media: "FB", mediaType: "多媒體廣告", profit: "7%", sDT: "2023/01/02", eDT: "2023/05/06", expectCost: "31000", realCost: "20000", isEdit: false },
    { clientName: "好事多", media: "FB", mediaType: "多媒體廣告", profit: "7%", sDT: "2023/01/02", eDT: "2023/05/06", expectCost: "31000", realCost: "20000", isEdit: false },
    { clientName: "好事多", media: "FB", mediaType: "多媒體廣告", profit: "7%", sDT: "2023/01/02", eDT: "2023/05/06", expectCost: "31000", realCost: "20000", isEdit: false },
    { clientName: "好事多", media: "FB", mediaType: "多媒體廣告", profit: "7%", sDT: "2023/01/02", eDT: "2023/05/06", expectCost: "31000", realCost: "20000", isEdit: false },
  ]

  ngOnInit(): void {
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
  onEdit(status: DataModel) {
    status.isEdit = true;
  }
  onSave(status: DataModel) {
    status.isEdit = false;
  }
  onCancel(status: DataModel) {
    status.isEdit = false;
  }
}
export interface DataModel {
  /**客戶名稱 */
  clientName?: string;
  /**媒體選項 */
  media: string;
  /**媒體種類 */
  mediaType: string;
  /**利潤% */
  profit: string;
  /**開始日期*/
  sDT?: string;
  /**結束日期 */
  eDT?: string;
  /**總預算 */
  expectCost?: string;
  /**客戶實際花費 */
  realCost?: string;
  /**是否編輯 */
  isEdit: boolean;
}
