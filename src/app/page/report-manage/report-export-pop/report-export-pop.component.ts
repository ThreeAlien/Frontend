import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx-js-style";
import '../../../../assets/msjh-normal.js';

@Component({
  selector: 'app-report-export-pop',
  templateUrl: './report-export-pop.component.html',
  styleUrls: ['./report-export-pop.component.css']
})
//報表匯出
export class ReportExpotPopComponent implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<ReportExpotPopComponent>,
    public datePipe: DatePipe, private formBuilder: FormBuilder) { }
  firstFormGroup = this.formBuilder.group({
    dataList: this.formBuilder.array([
      this.formBuilder.group({
        sta: false,
        Id: "1",
        reportName: "每日報表",
        SD: '',
        ED: ''
      }),
      this.formBuilder.group({
        sta: false,
        Id: "2",
        reportName: "每周報表",
        SD: '',
        ED: ''
      })
    ])
  });
  isLinear = true;
  tableContainer = document.querySelector('.table-container');
  isIcon = true;
  //有勾選到的報表內容要給必填日期
  onCheckExport(value: any, data: FormGroup) {
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
  selectionChange(data: StepperSelectionEvent) {
    if (data.selectedIndex == 1) {
    }
  }
  @ViewChild('tableList', { static: true }) tableList?: ElementRef;
  ngAfterViewInit(): void {
    console.log(this.tableContainer);
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

