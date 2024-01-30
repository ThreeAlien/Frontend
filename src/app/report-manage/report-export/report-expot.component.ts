import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as printJS from 'print-js';
import { ApiService } from 'src/app/service/api.service';
import { MsgBoxService } from 'src/app/service/msg-box.service';
import { exportSampleManageModels, exportSampleManageModelsTest, media } from '../report-manage.models';
declare let $: any;

@Component({
  selector: 'app-report-expot',
  templateUrl: './report-expot.component.html',
  styleUrls: ['./report-expot.component.css']
})
//報表匯出
export class ReportExpotComponent implements AfterViewInit {
  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    public apiService: ApiService,
    private msgBoxService: MsgBoxService) { }
  tableContainer = document.querySelector('.table-container');
  @ViewChild('tableList', { static: true }) tableList?: ElementRef;
  exportSampleData = new MatTableDataSource(Data);
  displayedColumns: string[] = ['accActName', 'exptSampleName', 'goalAds', 'mediaType', 'creatDt'];
  ngAfterViewInit(): void {
    console.log(this.tableContainer);
  }
  async addExmTest() {
    const tableElement = this.tableList?.nativeElement;
    if (tableElement) {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          this.captureAndPrint(tableElement, resolve);
        }, 1000);
      });
    }
  }

  private captureAndPrint(tableElement: HTMLElement, resolve: () => void) {
    const options = {
      //background: "white",
      useCORS: true,
      scrollY: -window.scrollY,
      width: tableElement.scrollWidth,
      height: tableElement.scrollHeight,
      scale: 3
    };
    //未生成pdf的html頁面高度

    html2canvas(tableElement, options)
      .then(canvas => {
        //未生成pdf的html頁面高度
        let leftHeight = canvas.height;
        //一頁pdf顯示html頁面生成的canvas高度;
        let pageHeight = canvas.width / 595.28 * 841.89;
        let img = canvas.toDataURL("image/jpeg", 1.0);
        let pdf = new jsPDF("p", "pt", "a4");
        //a4紙的尺寸[595.28,841.89]，html頁面生成的canvas在pdf中圖片的寬高
        let imgWidth = 595.28;
        let imgHeight = 555.28 / canvas.width * canvas.height;
        //pdf頁面偏移
        let position = 0;
        if (leftHeight < pageHeight) {
          pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);
          return pdf;
        } else {
          while (leftHeight > 0) {
            pdf.addImage(img, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight;
            position -= 841.89;
            //避免添加空白頁
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
          return pdf;
        }
        //需要dataUrl格式
        // pdf.addImage(img, "JPEG", 20, 0, 555.28, (555.28 / canvas.width) * canvas.height
        // );
        // console.log(pdf);
        // return pdf;
      })
      .then(doc => {
        doc.save("Test" + ".pdf");
        // this.pdbOKClick = true; // 下載完畢後開放
        // this.downloadPDFbtnCss = "btn btn-primary"; //CSS變更回來
      });
    // html2canvas(tableElement, {
    //   useCORS: true,
    //   scrollY: -window.scrollY,
    //   width: tableElement.scrollWidth,
    //   height: tableElement.scrollHeight,
    //   scale: 2
    // }).then((canvas) => {
    //   printJS({
    //     printable: canvas,
    //     type: 'html',
    //     documentTitle: "文件標題",
    //   });
    //   resolve();
    // }).catch((error) => {
    //   console.error('html2canvas error:', error);
    //   resolve();
    // });
  }
}
/**報表範本資料*/
const Data: exportSampleManageModelsTest[] = [
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
  { accActName: "家樂福_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "Nike_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/13" },
  { accActName: "家樂福_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "家樂福_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "家樂福_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "Nike_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/13" },
  { accActName: "家樂福_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "家樂福_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "家樂福_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "Nike_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/13" },
  { accActName: "家樂福_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "家樂福_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "家樂福_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "Nike_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/13" },
  { accActName: "家樂福_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "家樂福_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "家樂福_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "Nike_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/13" },
  { accActName: "家樂福_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "家樂福_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "家樂福_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "Nike_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/13" },
  { accActName: "家樂福_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "家樂福_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "家樂福_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },
  { accActName: "Nike_水果_購物廣告", exptSampleName: "範本名稱1", goalAds: "購物廣告", mediaType: media.Google, creatDt: "2023/07/13" },
  { accActName: "家樂福_鞋子_觸及廣告", exptSampleName: "範本名稱1", goalAds: "觸及廣告", mediaType: media.FB, creatDt: "2023/07/12" },
  { accActName: "家樂福_衣服_流量廣告", exptSampleName: "範本名稱2", goalAds: "流量廣告", mediaType: media.FB, creatDt: "2023/07/13" },
  { accActName: "家樂福_玩具_互動廣告", exptSampleName: "範本名稱3", goalAds: "互動廣告", mediaType: media.FB, creatDt: "2023/07/14" },

];
