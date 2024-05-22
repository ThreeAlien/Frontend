import { CommonService } from 'src/app/share/service/common.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DatePipe, NgFor } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { environment } from 'src/environments/environment';
import { DialogResult, MsgBoxBtnType, MsgBoxInfo } from '../../share/msg-box/msg-box.component';
import { AddRepExmplePopComponent } from './add-rep-exmple-pop/add-rep-exmple-pop.component';
import { ReportExpotPopComponent } from './report-export-pop/report-export-pop.component';
import { GetReportRequest, exportSampleModels, GoalAdsMapping, reportGoalAdsModel as reportGoalAdsModel } from './report-manage.models';
import { MessageService, SortEvent, SharedModule } from 'primeng/api';
import { BaseResponse, LoginInfoModel } from 'src/app/share/Models/share.model';
import { TableModule } from 'primeng/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from '../../share/loading/loading.component';
import { ApiService } from 'src/app/share/service/api.service';
import { LoadingService } from 'src/app/share/service/loading.service';
import { MsgBoxService } from 'src/app/share/service/msg-box.service';
import { LoginInfoService } from 'src/app/share/service/login-info.service';
import { catchError, map, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-report-manage',
  templateUrl: './report-manage.component.html',
  styleUrls: ['./report-manage.component.css'],
  standalone: true,
  imports: [LoadingComponent, ToastModule, MatCardModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, MatSelectModule, NgFor, MatOptionModule, MatDatepickerModule, MatButtonModule, MatIconModule, TableModule, SharedModule]
})
export class ReportManageComponent implements OnInit {
  constructor(private _liveAnnouncer: LiveAnnouncer, private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public apiService: ApiService,
    private msgBoxService: MsgBoxService,
    public loadingService: LoadingService,
    private messageService: MessageService,
    private CommonSvc: CommonService, private loginInfoSvc: LoginInfoService) { };
  displayedColumns: string[] = ['client_subname', 'report_name', 'report_goalads', 'report_media', 'edit_date', 'func'];
  Data: exportSampleModels[] = [];
  /**報表範本名稱 */
  reportName = "";
  /**開始時間 */
  sD = "";
  /**結束時間 */
  eD = "";
  totalCount = 0;
  /**資料總比數 */
  dataCount = 0;
  msgData = new MsgBoxInfo;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;
  /**媒體類型 */
  Media: string = "";
  MediaList = [
    { value: 'google', viewValue: 'Google' },
    { value: 'fb', viewValue: 'FB' }
  ]
  /**目標廣告 */
  reportGoalAds: string = "";
  reportGoalAdsList: reportGoalAdsModel[] = [
    { goalId: "sem", goalName: GoalAdsMapping.glgSem },
    { goalId: "gdn", goalName: GoalAdsMapping.glgGdn },
    { goalId: "yt", goalName: GoalAdsMapping.glgYt },
    { goalId: "shop", goalName: GoalAdsMapping.glgShop },
    { goalId: "pmas", goalName: GoalAdsMapping.glgPmas },
    { goalId: "kw", goalName: GoalAdsMapping.glgKw },
  ];

  async ngOnInit() {
    (await this.CommonSvc.getClinetName()).pipe(
      tap(() => this.loadingService.loadingOn()),
      switchMap(() => this.CommonSvc.getChildName())
    ).subscribe({
      next: () => { this.loadingService.loadingOff(); }
    });
    await this.getRepExm();
    this.cdr.detectChanges(); // 手動觸發變更偵測
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
  /**查詢按鈕 */
  async filterQry() {
    let reqData: GetReportRequest = {
      reportName: this.reportName,
      reportGoalAds: this.reportGoalAds,
      reportMedia: this.Media,
      startDate: this.sD,
      endDate: this.eD,
      userId: ''
    }
    await this.getRepExm(reqData);
  }
  /**新增範本按鈕 */
  addExmBtn() {
    /**data 總數量 */
    var count = (this.dataCount + 1).toString();
    const dialogRef = this.dialog.open(AddRepExmplePopComponent, {
      width: "91vw",
      maxWidth: "91vw",
      height: "75%",
      maxHeight: "91vh",
      data: { data: count, type: 'add' },
      hasBackdrop: true,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(async result => {
      if (result.data && result.type == "add") {
        this.messageService.add({ severity: 'success', summary: '成功', detail: '新增範本成功!' });
        await this.getRepExm();
      }
    });
  }
  /**編輯範本按鈕 */
  editReportBtn(data: any) {
    const dialogRef = this.dialog.open(AddRepExmplePopComponent, {
      width: "91vw",
      maxWidth: "91vw",
      height: "auto",
      maxHeight: "91vh",
      data: { data: data, type: 'edit' },
      hasBackdrop: true,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(async result => {
      if (result.data && result.type == "edit") {
        this.messageService.add({ severity: 'success', summary: '成功', detail: '編輯範本成功!' });
        await this.getRepExm();
      }
    });
  }
  /**匯出範本按鈕 */
  exportBtn(data: exportSampleModels) {
    const dialogRef = this.dialog.open(ReportExpotPopComponent, {
      width: "1390px",
      maxHeight: "760px",
      height: "auto",
      data: data,
      hasBackdrop: true,
      disableClose: true
    })
    dialogRef.afterClosed().subscribe(async result => {
      return false;
    });
  }
  /**複製按鈕 */
  exportCopyBtn(data: exportSampleModels) {
    this.msgData = new MsgBoxInfo;
    this.msgData.title = "提醒";
    this.msgData.msg = `確定要複製此【${data.reportName}】報表?`
    this.msgData.btnType = MsgBoxBtnType.ok_cancel;
    const msgResult = this.msgBoxService.msgBoxShow(this.msgData);
    msgResult.then(async x => {
      if (x?.result == DialogResult.ok) {
        this.copyReport(data.columnID).pipe(          
          tap(x=>console.log(x)),
          map(async res => {
            if (res) {              
              await this.getRepExm();
            }
          })
        ).subscribe();
      } else {
        return;
      }
    })
  }
  /**刪除按鈕 */
  async deleteReportBtn(data: exportSampleModels) {
    this.msgData = new MsgBoxInfo;
    this.msgData.title = "警告";
    this.msgData.msg = `確定要刪除此【${data.reportName}】?`
    this.msgData.btnType = MsgBoxBtnType.ok_cancel;

    const msgResult = this.msgBoxService.msgBoxShow(this.msgData);
    msgResult.then(async x => {
      if (x?.result == DialogResult.ok) {
        await this.deleteReport(data.columnID);
        await this.getRepExm();
      } else {
        return;
      }
    })
  }
  /**清除按鈕 */
  async clean() {
    this.reportName = "";
    this.reportGoalAds = "";
    this.sD = "";
    this.eD = "";
    this.Media = "";
    await this.getRepExm();
  }
  changeSort(sortInfo: Sort) {
    if (sortInfo.direction) {

    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  //#region API 相關
  /**取得報表範本 */
  async getRepExm(req?: GetReportRequest) {
    try {
      this.loadingService.loadingOn();
      let sD = this.datePipe.transform(req?.startDate, 'yyyy/MM/dd');
      let eD = this.datePipe.transform(req?.endDate, 'yyyy/MM/dd');
      let request: GetReportRequest = {
        reportName: req ? req.reportName : '',
        reportGoalAds: req ? req.reportGoalAds : '',
        reportMedia: req ? req.reportMedia : '',
        startDate: sD ? sD : '',
        endDate: eD ? eD : '',
        userId: this.loginInfoSvc.userInfo.id
      }
      this.msgData = new MsgBoxInfo;
      const qryDataUrl = environment.apiServiceHost + `api/ReportInfo/GetReport`;
      return new Promise<void>((resolve) => {
        this.apiService.CallApi(qryDataUrl, 'POST', request).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            this.Data = [];
            if (data.data) {
              data.data.forEach((x: exportSampleModels) => {
                x.createDate = this.datePipe.transform(x.createDate, 'yyyy/MM/dd') || '';
                x.editDate = this.datePipe.transform(x.editDate, 'yyyy/MM/dd') || '';
                this.reportGoalAdsList.forEach(tm => {
                  if (x.reportGoalAds == tm.goalId) {
                    x.reportGoalAds = tm.goalName;
                  }
                })
                this.Data.push(x);
              });
              let now = new Date();
              this.dataCount = this.Data.filter(x => x.createDate == this.datePipe.transform(now, "yyyy/MM/dd")).length;
            } else {
              var data = res as BaseResponse;
              this.msgData.title = `回應碼${data.code}`;
              this.msgData.msg = `取得報表範本API-訊息${data.msg}`;
              this.msgBoxService.msgBoxShow(this.msgData);
            }
            this.loadingService.loadingOff();
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            this.loadingService.loadingOff();
          },
        });
      })
    }
    catch (e: any) {
      this.msgBoxService.msgBoxShow(e.toString());
      this.loadingService.loadingOff();
    }

  }
  /**複製報表API */
  copyReport(id: string) {
    const request = { columnID: id };
    let rD = JSON.stringify(request);
    const path = environment.apiServiceHost + `api/ReportContentInfo/CopyReportContentInfo`;
    return this.apiService.CallApi(path, 'POST', rD).pipe(
      map(res => res && res.code ? res.code : []),
      map(code => {
        if (code == "200") {          
          return true;
        }else{          
          return false;
        }
      }),
      catchError(async (err) => {
        this.msgSvc.add({ severity: 'error', summary: '錯誤', detail: '複製報表未知錯誤!' });        
        return false;
      })
    )
  }
  /**刪除範本api */
  deleteReport(id: string) {
    try {
      this.loadingService.loadingOn();
      const request = {
        columnID: id,
        reportStatus: true
      };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/ReportInfo/DeleteReport`;
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            if (data.code == "200") {
              this.messageService.add({ severity: 'success', summary: '成功', detail: '報表範本已刪除!' });
            } else {
              this.messageService.add({ severity: 'error', summary: '失敗', detail: '刪除報表範本失敗!' });
            }
            this.loadingService.loadingOff();
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            this.loadingService.loadingOff();
            reject()
          },
        });
      })
    }
    catch (e: any) {
      this.loadingService.loadingOff();
      return;
    }
  }
  //#endregion
}
