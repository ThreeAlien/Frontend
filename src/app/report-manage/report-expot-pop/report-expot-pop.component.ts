import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ApiService } from 'src/app/service/api.service';
import { MsgBoxService } from 'src/app/service/msg-box.service';
import * as XLSX from "xlsx-js-style";

@Component({
  selector: 'app-report-expot-pop',
  templateUrl: './report-expot-pop.component.html',
  styleUrls: ['./report-expot-pop.component.css']
})
//報表匯出
export class ReportExpotPopComponent implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<ReportExpotPopComponent>,
    public datePipe: DatePipe,
    public apiService: ApiService,
    private msgBoxService: MsgBoxService) { }
  tableContainer = document.querySelector('.table-container');
  isIcon = true;
  @ViewChild('tableList', { static: true }) tableList?: ElementRef;
  displayedColumns: string[] = ['accActName', 'exptSampleName', 'goalAds', 'mediaType', 'creatDt'];
  ngAfterViewInit(): void {
    console.log(this.tableContainer);
  }
   /**
   * 匯出PDF報表
   */
  async exportPDF() {
    console.log("印下PDF");
    try{
      const tableElement = this.tableList?.nativeElement;
    if (tableElement) {
      await new Promise<void>((resolve) => {
        this.isIcon = false;
        setTimeout(() => {
          this.captureAndPrint(tableElement, resolve);
        }, 1000);
      });
    }
    }catch(e){
      console.log(e)
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
        this.isIcon = true;
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
  title = 'Excel';
  /**
   * 匯出EXCEL報表
   */
  exportExcel() {
    //TODO 寫Model 測試先直接覆蓋
    let lastRow = -1;
    let excelTable;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    try {
      this.TestData.forEach(x=>{
        excelTable = document.getElementById(x.tableID);
      })
      this.TestData.forEach(x => {
        var excelTable = document.getElementById(x.tableID);
        let ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(excelTable);
        //抓最後一比在第幾行
        for (let i in ws) {
          if (typeof ws[i] !== 'object') continue;
          let cell = XLSX.utils.decode_cell(i);
          if (cell.r > lastRow && ws[i].t !== undefined) {
            lastRow = cell.r;
          }
        }
        for (var i in ws) {
          if (typeof ws[i] != 'object') continue;
          let cell = XLSX.utils.decode_cell(i);
          //整個table
          ws[i].s = {
            //字形
            font: {
              name: 'arial',
              sz: 14
            },
            //字體位置
            alignment: {
              vertical: 'center',
              horizontal: 'center',
              wrapText: true,//換行
            },
          }
          //給每行一個顏色
          if (cell.r % 2) {
            // every other row
            ws[i].s.fill = {
              // background color
              patternType: 'solid',
              fgColor: { rgb: 'EAEEE5' },
            };
          }
          //第一列跟最後一列(標題)
          if (cell.r == 0 || cell.r == lastRow) {
            ws[i].s = {
              font: {
                bold: true,
                name: 'arial',
                sz: 16
              },
              //字體位置
              alignment: {
                vertical: 'center',
                horizontal: 'center',
                wrapText: true,//換行
              },
              fill: {
                patternType: 'solid',
                fgColor: { rgb: '7ABD87' },
              }
            };
          }
          ws['!cols']?.push({ wch: 15 });
        }
        XLSX.utils.book_append_sheet(wb, ws, x.title);
      });
      XLSX.writeFile(wb, 'ScoreSheet.xlsx');
    } catch (e) {
      console.log(e);
    }
  }/**產生假資料*/
  addReportTestData(count:number) {
    this.tableCount = count +1;
    this.TestData.push({
      title: "每周報表",
      tableID: "table_" + (this.tableCount).toString(),
      colNameList: [
        { colName: "日期", width: "18%" },
        { colName: "曝光數", width: "12%" },
        { colName: "點擊數", width: "12%" },
        { colName: "點閱率", width: "12%" },
        { colName: "CPC", width: "12%" },
        { colName: "費用", width: "14%" },
        { colName: "總收益", width: "14%" },
      ],
      tableList: [
        {
          tdList: [
            { data: "2023-10-25" },
            { data: "200" },
            { data: "100" },
            { data: "10" },
            { data: "150" },
            { data: "17000" },
            { data: "700000" }
          ]
        },
        {
          tdList: [
            { data: "2023-10-06" },
            { data: "200" },
            { data: "100" },
            { data: "10" },
            { data: "150" },
            { data: "17000" },
            { data: "700000" }
          ]
        },
        {
          tdList: [
            { data: "2023-11-06" },
            { data: "200" },
            { data: "100" },
            { data: "10" },
            { data: "150" },
            { data: "17000" },
            { data: "700000" }
          ]
        },
      ],
      footerList: [
        { data: "總計" }, { data: "400" }, { data: "1040" }, { data: "160%" }, { data: "5548" }, { data: "$578954526" }, { data: "$12246868" },
      ]
    },)
    this.tableCount = this.tableCount +1;
    this.TestData.push({
      title: "每月報表",
      tableID: "table_" + (this.tableCount).toString(),
      colNameList: [
        { colName: "日期", width: "18%" },
        { colName: "曝光數", width: "12%" },
        { colName: "點擊數", width: "12%" },
        { colName: "點閱率", width: "12%" },
        { colName: "CPC", width: "12%" },
        { colName: "費用", width: "14%" },
        { colName: "總收益", width: "14%" },
      ],
      tableList: [
        {
          tdList: [
            { data: "2023-11-06" },
            { data: "200" },
            { data: "100" },
            { data: "10" },
            { data: "150" },
            { data: "17000" },
            { data: "700000" }
          ]
        },
        {
          tdList: [
            { data: "2023-12-06" },
            { data: "200" },
            { data: "100" },
            { data: "10" },
            { data: "150" },
            { data: "17000" },
            { data: "700000" }
          ]
        },
        {
          tdList: [
            { data: "2023-13-06" },
            { data: "200" },
            { data: "100" },
            { data: "20" },
            { data: "150" },
            { data: "17000" },
            { data: "700000" }
          ]
        },
      ],
      footerList: [
        { data: "總計" }, { data: "400" }, { data: "1040" }, { data: "160%" }, { data: "5548" }, { data: "$578954526" }, { data: "$12246868" },
      ]
    },)
  }
  onCancel(): void {
    this.dialogRef.close({ data: false });
  }
  tableCount = 0;
  TestData = [
    {
      title: "每日報表",
      tableID: "table_" + this.tableCount.toString(),
      colNameList: [
        { colName: "日期", width: "18%" },
        { colName: "曝光數", width: "12%" },
        { colName: "點擊數", width: "12%" },
        { colName: "點閱率", width: "12%" },
        { colName: "CPC", width: "12%" },
        { colName: "費用", width: "14%" },
        { colName: "總收益", width: "14%" },
      ],
      tableList: [
        {
          tdList: [
            { data: "2023-09-06" },
            { data: "200" },
            { data: "100" },
            { data: "10" },
            { data: "150" },
            { data: "17000" },
            { data: "700000" }
          ]
        },
        {
          tdList: [
            { data: "2023-10-06" },
            { data: "200" },
            { data: "100" },
            { data: "10" },
            { data: "150" },
            { data: "17000" },
            { data: "700000" }
          ]
        },
        {
          tdList: [
            { data: "2023-11-06" },
            { data: "200" },
            { data: "100" },
            { data: "10" },
            { data: "150" },
            { data: "17000" },
            { data: "700000" }
          ]
        },
      ],
      footerList: [
        { data: "總計" }, { data: "400" }, { data: "1040" }, { data: "160%" }, { data: "5548" }, { data: "$578954526" }, { data: "$12246868" },
      ]
    }
  ]
}

