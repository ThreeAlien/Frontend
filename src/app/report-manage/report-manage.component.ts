import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { data } from 'jquery';
import { AddRepExmplePopComponent } from './add-rep-exmple-pop/add-rep-exmple-pop.component';
import { exportSampleManageModels, media } from './report-manage.models';

@Component({
  selector: 'app-report-manage',
  templateUrl: './report-manage.component.html',
  styleUrls: ['./report-manage.component.css']
})
export class ReportManageComponent implements AfterViewInit {

  constructor(private _liveAnnouncer: LiveAnnouncer, public dialog: MatDialog) { };
  displayedColumns: string[] = ['accActName', 'exptSampleName', 'goalAds', 'mediaType', 'creatDt', 'func'];
  exportSampleData = new MatTableDataSource(Data);
  totalCount = 0;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;


  ngAfterViewInit() {
    this.exportSampleData.paginator = this.paginator;
    this.exportSampleData.sort = this.sort;
  }
  //#region 關鍵字搜尋


  /**快速搜尋客戶名稱 */
  filterAccName() {
    this.exportSampleData.filterPredicate = (data: exportSampleManageModels, filter: string) => {
      return data.accActName.toLocaleLowerCase().includes(filter);
    };
  }
  filterAcc(event: Event) {
    this.filterAccName();
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log(filterValue);
    //console.log(this.filterAccName());
    this.exportSampleData.filter = filterValue;
  }
  /**快速搜尋範本名稱 */
  filterExmName() {
    this.exportSampleData.filterPredicate = (data: exportSampleManageModels, filter: string) => {
      return data.exptSampleName.toLocaleLowerCase().includes(filter);
    };
  }
  filterExm(event: Event) {
    this.filterExmName();
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log(filterValue);
    //console.log(this.filterAccName());
    this.exportSampleData.filter = filterValue;
  }
  /**快速搜尋目標廣告 */
  filterGoalAds() {
    this.exportSampleData.filterPredicate = (data: exportSampleManageModels, filter: string) => {
      return data.goalAds.toLocaleLowerCase().includes(filter);
    };
  }
  filterGoal(event: Event) {
    this.filterGoalAds();
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    console.log(filterValue);
    this.exportSampleData.filter = filterValue;
  }

  //#endregion
  addExm() {
    const dialogRef = this.dialog.open(AddRepExmplePopComponent, {
      width: "1080px",
      maxHeight: "600px",
      height: "auto",
      data: null,
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

  //#endregion
}
/**報表範本資料*/
const Data: exportSampleManageModels[] = [
  { accActName: "好市多_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "好市多_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "好市多_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "好市多_觸及廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.IG, creatDt: "2023/07/15" },
  { accActName: "好市多_食物_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.IG, creatDt: "2023/07/16" },
  { accActName: "好市多_露營_搜尋廣告", exptSampleName: "範本名稱1", goalAds: "搜尋廣告", mediaType: media.Google, creatDt: "2023/07/11" },
  { accActName: "好市多_工具_影音廣告", exptSampleName: "範本名稱2", goalAds: "影音廣告", mediaType: media.Google, creatDt: "2023/07/19" },
  { accActName: "好市多_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/18" },
  { accActName: "全聯_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "全聯_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "全聯_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "全聯_觸及_觸及廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.IG, creatDt: "2023/07/15" },
  { accActName: "全聯_食物_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.IG, creatDt: "2023/07/16" },
  { accActName: "全聯_露營_搜尋廣告", exptSampleName: "範本名稱1", goalAds: "搜尋廣告", mediaType: media.Google, creatDt: "2023/07/11" },
  { accActName: "全聯_工具_影音廣告", exptSampleName: "範本名稱2", goalAds: "影音廣告", mediaType: media.Google, creatDt: "2023/07/19" },
  { accActName: "全聯_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/18" },
  { accActName: "Nike_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/01" },
  { accActName: "Nike_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "Nike_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "Nike_觸及_觸及廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.IG, creatDt: "2023/07/05" },
  { accActName: "Nike_食物_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.IG, creatDt: "2023/07/16" },
  { accActName: "Nike_露營_搜尋廣告", exptSampleName: "範本名稱1", goalAds: "搜尋廣告", mediaType: media.Google, creatDt: "2023/07/11" },
  { accActName: "Nike_工具_影音廣告", exptSampleName: "範本名稱2", goalAds: "影音廣告", mediaType: media.Google, creatDt: "2023/07/12" },
  { accActName: "Nike_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/13" },
  { accActName: "家樂福_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "家樂福_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "家樂福_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "家樂福_觸及_觸及廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.IG, creatDt: "2023/07/15" },
  { accActName: "家樂福_食物_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.IG, creatDt: "2023/07/16" },
  { accActName: "家樂福_露營_搜尋廣告", exptSampleName: "範本名稱1", goalAds: "搜尋廣告", mediaType: media.Google, creatDt: "2023/07/11" },
  { accActName: "家樂福_工具_影音廣告", exptSampleName: "範本名稱2", goalAds: "影音廣告", mediaType: media.Google, creatDt: "2023/07/19" },
  { accActName: "家樂福_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/18" },
];
