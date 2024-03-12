import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { ApiService } from '../../service/api.service';
import { MsgBoxService } from '../../service/msg-box.service';
import { MsgBoxInfo } from '../../share/msg-box/msg-box.component';
import { AddRepExmplePopComponent } from './add-rep-exmple-pop/add-rep-exmple-pop.component';
import { ReportExpotPopComponent } from './report-export-pop/report-export-pop.component';
import { exportSampleManageModels, media } from './report-manage.models';
import { SortEvent } from 'primeng/api';
import { BaseResponse } from 'src/app/share/Models/share.model';

@Component({
  selector: 'app-report-manage',
  templateUrl: './report-manage.component.html',
  styleUrls: ['./report-manage.component.css']
})
export class ReportManageComponent implements AfterViewInit {
  constructor(private _liveAnnouncer: LiveAnnouncer,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public apiService: ApiService,
    private msgBoxService: MsgBoxService) { };
  displayedColumns: string[] = ['client_subname', 'report_name', 'report_goalads', 'report_media', 'edit_date', 'func'];
  Data: exportSampleManageModels[] = [
    { report_id: "123", report_name: "Nike", report_media: media.Google, report_goalads: "目標廣告", report_status: "Y", column_id: "123", creat_cname: "wider", client_subname: "123", creat_date: "2023/11/04", edit_cname: "willy", edit_date: "2023/11/05", sub_id: "123" },
    { report_id: "123", report_name: "Nike", report_media: media.Google, report_goalads: "目標廣告", report_status: "Y", column_id: "123", creat_cname: "wider", client_subname: "123", creat_date: "2023/11/04", edit_cname: "willy", edit_date: "2023/11/05", sub_id: "123" },
    { report_id: "123", report_name: "Nike", report_media: media.FB, report_goalads: "目標廣告", report_status: "Y", column_id: "123", creat_cname: "wider", client_subname: "123", creat_date: "2023/11/04", edit_cname: "willy", edit_date: "2023/11/05", sub_id: "123" },
    { report_id: "123", report_name: "家樂福", report_media: media.Google, report_goalads: "目標廣告", report_status: "Y", column_id: "123", creat_cname: "wider", client_subname: "123", creat_date: "2023/11/04", edit_cname: "willy", edit_date: "2023/11/05", sub_id: "123" },
    { report_id: "123", report_name: "家樂福", report_media: media.FB, report_goalads: "目標廣告", report_status: "Y", column_id: "123", creat_cname: "wider", client_subname: "123", creat_date: "2023/11/04", edit_cname: "willy", edit_date: "2023/11/05", sub_id: "123" },
    { report_id: "123", report_name: "家樂福", report_media: media.Google, report_goalads: "目標廣告", report_status: "Y", column_id: "123", creat_cname: "wider", client_subname: "123", creat_date: "2023/11/04", edit_cname: "willy", edit_date: "2023/11/05", sub_id: "123" },
    { report_id: "123", report_name: "好市多", report_media: media.FB, report_goalads: "目標廣告", report_status: "Y", column_id: "123", creat_cname: "wider", client_subname: "123", creat_date: "2023/11/04", edit_cname: "willy", edit_date: "2023/11/05", sub_id: "123" },
    { report_id: "123", report_name: "好市多", report_media: media.FB, report_goalads: "目標廣告", report_status: "Y", column_id: "123", creat_cname: "wider", client_subname: "123", creat_date: "2023/11/04", edit_cname: "willy", edit_date: "2023/11/05", sub_id: "123" },
    { report_id: "123", report_name: "好市多", report_media: media.Google, report_goalads: "目標廣告", report_status: "Y", column_id: "123", creat_cname: "wider", client_subname: "123", creat_date: "2023/11/04", edit_cname: "willy", edit_date: "2023/11/05", sub_id: "123" },

  ];
  totalCount = 0;
  /**資料總比數 */
  dataCount = 0;
  msgData = new MsgBoxInfo;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  Media: any;
  MediaList = [
    { value: '0', viewValue: 'Google' },
    { value: '1', viewValue: 'FB' },
    { value: '2', viewValue: 'IG' },
  ]

  async ngAfterViewInit() {
    await this.getRepExm();
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
  /**新增範本按鈕 */
  addExmBtn() {
    /**data 總數量 */
    var count = (this.dataCount + 1).toString();
    const dialogRef = this.dialog.open(AddRepExmplePopComponent, {
      width: "91vw",
      maxWidth: "91vw",
      height: "auto",
      maxHeight: "91vh",
      data: count,
      hasBackdrop: true,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(async result => {
      console.log(result);
    });
  }
  /**匯出範本按鈕 */
  exportBtn() {
    var count = (this.dataCount + 1).toString();
    const dialogRef = this.dialog.open(ReportExpotPopComponent, {
      width: "1080px",
      maxHeight: "760px",
      height: "auto",
      data: count,
      hasBackdrop: true,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(async result => {
      console.log(result);
    });
  }
  changeSort(sortInfo: Sort) {
    console.log(sortInfo);
    if (sortInfo.direction) {

    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  //#region API 相關
  /**取得報表範本 */
  async getRepExm() {
    try {
      this.msgData = new MsgBoxInfo;
      const qryDataUrl = environment.apiServiceHost + `api/ReportInfo/GetReport`;
      console.log(qryDataUrl);
      this.apiService.CallApi(qryDataUrl, 'GET', { BaseResponse }).subscribe({
        next: (res) => {
          var data = res as BaseResponse;
          console.log(data);
          if (data.data) {
            data.data.forEach((x: exportSampleManageModels) => {
              //x.edit_date = this.datePipe.transform(x.edit_date, 'yyyy/MM/dd');
              x.report_media = x.report_media == "ADS" ? media.Google : "";
              this.Data.push(x);
            });
            this.dataCount = this.Data.length;
            console.log(this.Data);
          } else {
            var data = res as BaseResponse;
            this.msgData.title = `回應碼${data.code}`;
            this.msgData.msg = `取得報表範本API-訊息${data.msg}`;
            this.msgBoxService.msgBoxShow(this.msgData);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
      });
    }
    catch (e: any) {
      this.msgBoxService.msgBoxShow(e.toString());
    }

  }
  //#endregion
}
