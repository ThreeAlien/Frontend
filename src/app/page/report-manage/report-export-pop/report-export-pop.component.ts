import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx-js-style";
import '../../../../assets/msjh-normal.js';
import { BaseResponse } from 'src/app/share/Models/share.model.js';
import { ApiService } from 'src/app/service/api.service';
import { HttpErrorResponse } from '@angular/common/http/index.js';
import { environment } from 'src/environments/environment';
import { getReportDetailRes } from '../report-manage.models.js';


@Component({
  selector: 'app-report-export-pop',
  templateUrl: './report-export-pop.component.html',
  styleUrls: ['./report-export-pop.component.css']
})
//報表匯出
export class ReportExpotPopComponent implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<ReportExpotPopComponent>, @Inject(MAT_DIALOG_DATA) public inPutdata: any,
    public datePipe: DatePipe, private formBuilder: FormBuilder, public apiService: ApiService,) { }


  firstFormGroup = this.formBuilder.group({
    dataList: this.formBuilder.array([])
  });
  get dataList() {
    return this.firstFormGroup.get('dataList') as FormArray;
  }
  isLinear = true;
  tableContainer = document.querySelector('.table-container');
  isIcon = true;
  //報表內容id
  colId: string = "";
  @ViewChild('tableList', { static: true }) tableList?: ElementRef;
  async ngAfterViewInit(): Promise<void> {
    this.colId = this.inPutdata.columnID;
    await this.getReportDetail(this.colId);
    console.log(this.tableContainer);
    this.getExportGender();
  }
  //有勾選到的報表內容要給必填日期
  onCheckExport(value: any, data: any) {
    console.log(data);
    if (value) {
      data.controls['SD'].setValidators([Validators.required]);
      data.controls['ED'].setValidators([Validators.required]);
    } else {
      data.controls['SD'].clearValidators();
      data.controls['SD'].setErrors(null);
      data.controls['ED'].clearValidators();
      data.controls['ED'].setErrors(null);
    }
  }
  onCheckAll(value: any, data: any) {
    if (value.checked) {
      data.controls.forEach((x: FormGroup) => {
        x.controls['sta'].setValue(true);
      })
    } else {
      data.controls.forEach((x: FormGroup) => {
        x.controls['sta'].setValue(false);
      })
    }
  }
  /**步驟切換(案下一步) */
  selectionChange(data: StepperSelectionEvent) {
    //第一步
    if (data.selectedIndex == 0) {
      console.log("11111");
    }
    //第二步
    if (data.selectedIndex == 1) {
      console.log("22222");
    }
  }
  /**匯出PDF */
  exportPdfNG() {
    const doc = new jsPDF("p", "pt", "a4")
    doc.setFont('msjh');
    doc.text('XX有限公司', 14, 20)
    this.TestData.forEach(x => {
      autoTable(doc, {
        html: `#${x.tableID}`,
        tableWidth: 'auto',
        useCss: true,
        styles: {
          font: "msjh"
        }
      })
    })
    doc.save('table.pdf');
  }
  title = 'Excel';
  /** 匯出EXCEL報表 */
  exportExcel() {
    //TODO 寫Model 測試先直接覆蓋
    let lastRow = -1;
    let excelTable;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    try {
      this.TestData.forEach(x => {
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
          //第二列跟最後一列(標題)
          if (cell.r == 1 || cell.r == lastRow) {
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
  addReportTestData(count: number) {
    this.tableCount = count + 1;
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
        }
      ],
      footerList: [
        { data: "總計" }, { data: "400" }, { data: "1040" }, { data: "160%" }, { data: "5548" }, { data: "$578954526" }, { data: "$12246868" },
      ]
    },)
    this.tableCount = this.tableCount + 1;
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
  /**取得報表明細(報表欄位_匯出用)API */
  async getReportDetail(id?: string) {
    try {
      const request = { columnID: `${id}` };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/ReportInfo/GetReportDetail`;
      console.log(qryDataUrl);
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            console.log(data.data);
            let repColList: getReportDetailRes[];
            if (data.data) {
              repColList = data.data;
              console.log(repColList);
              this.dataList.setValue([]);
              repColList.forEach(x => {
                this.dataList.push(this.formBuilder.group({
                  sta: false,
                  Id: x.reportNo,
                  reportName: x.contentName,
                  SD: '',
                  ED: ''
                }));
              })
            }
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            reject();
          }
        });
      })
    }
    catch (e: any) {
      console.log(e);
    }
  }
  /**性別報表匯出API */
  getExportGender(id?: string, sd?: Date, ed?: Date) {
    try {
      let SD: Date = new Date("2024-02-01");
      let ED: Date = new Date("2024-03-28");
      const request = {
        campaignID: "850410164",
        startDate: SD,
        endDate: ED,
      };
      let rD = JSON.stringify(request);

      const qryDataUrl = environment.apiServiceHost + `api/ReportExport/ReportExportGender`;
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            let data = res as BaseResponse;
            if (data.data) {
              console.log(data);
            }
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            reject();
          }
        });
      })
    }
    catch (e: any) {
      console.log(e);
      return;
    }
  }
  /**年齡報表匯出API */


  /**關鍵字報表匯出 API */

  /**每日或每周報表匯出API */

  /**地區報表匯出 API*/

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

