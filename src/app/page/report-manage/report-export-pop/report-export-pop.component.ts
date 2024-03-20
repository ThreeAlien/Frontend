import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx-js-style";
import { BaseResponse } from 'src/app/share/Models/share.model';
import { ApiService } from 'src/app/service/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { exportSampleModels, getReportDetailRes } from '../report-manage.models';
import { ExportReportModel, colMapping, exportData } from './report-export-pop.model';
import { LoadingService } from 'src/app/service/loading.service';
import '../../../../assets/msjh-normal.js';
import { map } from 'jquery';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-report-export-pop',
  templateUrl: './report-export-pop.component.html',
  styleUrls: ['./report-export-pop.component.css']
})
//報表匯出
export class ReportExpotPopComponent implements AfterViewInit, OnInit {
  constructor(
    public dialogRef: MatDialogRef<ReportExpotPopComponent>, @Inject(MAT_DIALOG_DATA) public inPutdata: exportSampleModels,
    public datePipe: DatePipe, private formBuilder: FormBuilder, public apiService: ApiService,
    public loadingService: LoadingService, private messageService: MessageService) { }


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
  //子帳號ID
  subId: string = "";
  @ViewChild('tableList', { static: true }) tableList?: ElementRef;

  exportDataList: ExportReportModel[] = [];
  impressTotal: number = 0;
  clickTotal: number = 0;
  ctrTotal: string = "";
  cpcTotal: number = 0;
  costTotal: number = 0;
  /**總比數 */
  tableCount = 0;
  /**報表名稱 */
  reportName: string = "";
  /**是否顯示 關鍵字 footer */
  isKwEnable: boolean = false;

  async ngAfterViewInit(): Promise<void> {
    await this.getReportDetail(this.colId);
  }
  async ngOnInit(): Promise<void> {
    this.colId = this.inPutdata.columnID;
    this.subId = this.inPutdata.subID;
    this.reportName = this.inPutdata.reportName;

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
  async selectionChange(data: StepperSelectionEvent) {
    //第一步
    if (data.selectedIndex == 0) {
    }
    //第二步
    if (data.selectedIndex == 1) {
      let isExport = false;
      for (const x of this.dataList.controls) {
        if (x.value.sta) {
          isExport = true;
        }
      }
      if (isExport) {
        this.exportDataList = [];
        await this.getExportReport();
      }
    }
  }
  /**匯出PDF */
  async exportPdfNG() {
    const doc = new jsPDF("p", "pt", "a4")
    doc.setFont('msjh');
    doc.text('汎古數位媒體行銷股份有限公司', 14, 20)
    this.exportDataList.forEach(x => {
      autoTable(doc, {
        html: `#${x.tableId}`,
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
    let lastRow = -1;
    let excelTable;
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    try {
      this.exportDataList.forEach(x => {
        excelTable = document.getElementById(x.tableId);
      })
      this.exportDataList.forEach(x => {
        var excelTable = document.getElementById(x.tableId);
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
        XLSX.utils.book_append_sheet(wb, ws, x.reportName);
      });
      XLSX.writeFile(wb, 'ScoreSheet.xlsx');
    } catch (e) {
      console.log(e);
    }
  }
  onCancel(): void {
    this.dialogRef.close({ data: false });
  }
  //數值轉換台幣
  twFormat(coin: number): string {
    const twFormat = new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    });
    let res = twFormat.format(coin);
    //去除00
    res = res.replace(/\.\d{2}$/, '');
    return res;
  }
  //點閱率計算
  ctrCount(click: number, impression: number): string {
    let res = (click / impression) * 100;
    return Math.round(res).toFixed(1) + '%';
  }
  //cpc計算
  cpcCount(cost: number, click: number): string {
    let res = (cost / click) * 100;
    return res.toFixed(2);
  }
  //把每張報表設定ID
  setTableId() {
    return new Promise<void>((resolve, reject) => {
      for (let i = 0; i < this.exportDataList.length; i++) {
        this.exportDataList[i].tableId = `table_${i}`;
        console.log(this.exportDataList[i]);
      }
      resolve();
    });
  }
  exportReportCalled: boolean = false;
  /**匯出報表方法 */
  getExportReport() {
    return new Promise<void>(async (resolve, reject) => {
      for (const x of this.dataList.controls) {
        this.loadingService.loadingOn();
        if (x.value.sta == true) {
          switch (x.value.contentId) {
            //每日報表
            case "repCon00001":
              await this.getExportDayOrWeek(x.value.SD, x.value.ED, 'Day');
              break;
            //每周報表
            case "repCon00002":
              await this.getExportDayOrWeek(x.value.SD, x.value.ED, 'Week');
              break;
            //年齡報表
            case "repCon00005":
              await this.getExportAge(x.value.SD, x.value.ED);
              break;
            //性別報表
            case "repCon00006":
              await this.getExportGender(x.value.SD, x.value.ED);
              break;
            //地區報表
            case "repCon00007":
              await this.getExportLocation(x.value.SD, x.value.ED);
              break;
            //關鍵字
            case "repCon00015":
              await this.getExportKeyWord(x.value.SD, x.value.ED);
              break;
            default:
              this.loadingService.loadingOff();
              break;
          }
        }
      }
      await this.setTableId();
      this.loadingService.loadingOff();
      resolve();
    })

  }
  /**todo 要把Mapping帶進來  目前寫死欄位 */
  /**性別報表匯出API */
  getExportGender(sd: string, ed: string) {
    try {
      let SD = sd;
      let ED = ed;
      const request = {
        subId: this.subId,
        startDate: SD,
        endDate: ED,
      };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/ReportExport/ReportExportGender`;
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            let data = res as BaseResponse;
            if (data.data.length > 0) {
              data.data as exportData;
              console.log(data.data);
              let tmpD: ExportReportModel = {
                reportName: "性別成效",
                tableId: "",
                colNameList: [
                  { colValue: colMapping.genderTitie, colSta: true, width: "auto" },
                  { colValue: colMapping.impression, colSta: true, width: "auto" },
                  { colValue: colMapping.click, colSta: true, width: "auto" },
                  { colValue: colMapping.ctr, colSta: true, width: "auto" },
                  { colValue: colMapping.cpc, colSta: true, width: "auto" },
                  { colValue: colMapping.cost, colSta: true, width: "auto" },
                ],
                colValueList: [],
                totalList: []
              }
              data.data.forEach((x: exportData) => {
                tmpD.colValueList.push({ tdList: [] });
              });
              data.data.forEach((y: exportData, index: number) => {
                switch (y.gender) {
                  case "Male":
                    y.gender = colMapping.genderMale
                    break;
                  case "Female":
                    y.gender = colMapping.genderFemale
                    break;
                  case "Undetermined":
                    y.gender = colMapping.genderUnknow
                    break;
                }
                /**TODO 前端先處理  後端要改DB資料 */
                y.cost = y.cost / 1000000;
                y.ctr = this.ctrCount(y.click, y.impressions);
                y.cpc = Number(this.cpcCount(y.cost, y.click));

                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.gender, colSta: true },
                  { colValue: y.impressions, colSta: true },
                  { colValue: y.click, colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc), colSta: true },
                  { colValue: this.twFormat(y.cost), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = Number(this.cpcCount(this.costTotal, this.clickTotal));
              tmpD.totalList.push(
                { colValue: "總計", colSta: true },
                { colValue: `${this.impressTotal}`, colSta: true },
                { colValue: `${this.clickTotal}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal), colSta: true },
                { colValue: this.twFormat(this.costTotal), colSta: true },
              )

              this.exportDataList.push(tmpD);
            } else {
              this.messageService.add({ severity: 'error', summary: '錯誤', detail: '查無性別成效報表資訊!' })
            }
            this.loadingService.loadingOff();
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            this.loadingService.loadingOff();
            reject();
          }
        });
      })
    }
    catch (e: any) {
      console.log(e);
      this.loadingService.loadingOff();
      return;
    }
  }
  /**年齡報表匯出API */
  getExportAge(sd: string, ed: string) {
    try {
      let SD = sd;
      let ED = ed;
      const request = {
        subId: this.subId,
        startDate: SD,
        endDate: ED,
      };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/ReportExport/ReportExportAge`;
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            let data = res as BaseResponse;
            if (data.data.length > 0) {
              data.data as exportData;
              console.log(data.data);
              let tmpD: ExportReportModel = {
                reportName: "年齡成效",
                tableId: "",
                colNameList: [
                  { colValue: colMapping.ageTitle, colSta: true, width: "auto" },
                  { colValue: colMapping.impression, colSta: true, width: "auto" },
                  { colValue: colMapping.click, colSta: true, width: "auto" },
                  { colValue: colMapping.ctr, colSta: true, width: "auto" },
                  { colValue: colMapping.cpc, colSta: true, width: "auto" },
                  { colValue: colMapping.cost, colSta: true, width: "auto" },
                ],
                colValueList: [],
                totalList: []
              }
              data.data.forEach((x: exportData) => {
                tmpD.colValueList.push({ tdList: [] });
              });
              data.data.forEach((y: exportData, index: number) => {
                /**TODO 前端先處理  後端要改DB資料 */
                y.cost = y.cost / 1000000;
                y.ctr = this.ctrCount(y.click, y.impressions);
                y.cpc = Number(this.cpcCount(y.cost, y.click));

                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.age, colSta: true },
                  { colValue: y.impressions, colSta: true },
                  { colValue: y.click, colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc), colSta: true },
                  { colValue: this.twFormat(y.cost), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = Number(this.cpcCount(this.costTotal, this.clickTotal));
              tmpD.totalList.push(
                { colValue: "總計", colSta: true },
                { colValue: `${this.impressTotal}`, colSta: true },
                { colValue: `${this.clickTotal}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal), colSta: true },
                { colValue: this.twFormat(this.costTotal), colSta: true },
              )

              this.exportDataList.push(tmpD);
            } else {
              this.messageService.add({ severity: 'error', summary: '錯誤', detail: '查無年齡成效報表資訊!' })
            }
            this.loadingService.loadingOff();
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            this.loadingService.loadingOff();
            reject();
          }
        });
      })
    }
    catch (e: any) {
      this.loadingService.loadingOff();
      console.log(e);
      return;
    }
  }
  /**關鍵字報表匯出 API */
  getExportKeyWord(sd: string, ed: string) {
    try {
      let SD = sd;
      let ED = ed;
      const request = {
        subId: this.subId,
        startDate: SD,
        endDate: ED,
      };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/ReportExport/ReportExportKeyWord`;
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            let data = res as BaseResponse;
            if (data.data.length > 0) {
              data.data as exportData;
              console.log(data.data);
              let tmpD: ExportReportModel = {
                reportName: "關鍵字成效",
                tableId: "",
                colNameList: [
                  { colValue: colMapping.kwCampaignName, colSta: true, width: "auto" },
                  { colValue: colMapping.kwAdGroupName, colSta: true, width: "auto" },
                  { colValue: colMapping.kwColSrchKeyWord, colSta: true, width: "auto" },
                  { colValue: colMapping.impression, colSta: true, width: "auto" },
                  { colValue: colMapping.click, colSta: true, width: "auto" },
                  { colValue: colMapping.ctr, colSta: true, width: "auto" },
                  { colValue: colMapping.cpc, colSta: true, width: "auto" },
                  { colValue: colMapping.cost, colSta: true, width: "auto" },
                ],
                colValueList: [],
                totalList: []
              }
              data.data.forEach((x: exportData) => {
                tmpD.colValueList.push({ tdList: [] });
              });
              data.data.forEach((y: exportData, index: number) => {
                /**TODO 前端先處理  後端要改DB資料 */
                y.cost = y.cost / 1000000;
                y.ctr = this.ctrCount(y.click, y.impressions);
                y.cpc = Number(this.cpcCount(y.cost, y.click));

                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.campaignName, colSta: true },
                  { colValue: y.adGroupName, colSta: true },
                  { colValue: y.colSrchKeyWord, colSta: true },
                  { colValue: y.impressions, colSta: true },
                  { colValue: y.click, colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc), colSta: true },
                  { colValue: this.twFormat(y.cost), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = Number(this.cpcCount(this.costTotal, this.clickTotal));
              tmpD.totalList.push(
                { colValue: `${this.impressTotal}`, colSta: true },
                { colValue: `${this.clickTotal}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal), colSta: true },
                { colValue: this.twFormat(this.costTotal), colSta: true },
              )

              this.exportDataList.push(tmpD);
            } else {
              this.messageService.add({ severity: 'error', summary: '錯誤', detail: '查無關鍵字報表資訊!' })
            }
            this.loadingService.loadingOff();
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            this.loadingService.loadingOff();
            reject();
          }
        });
      })
    }
    catch (e: any) {
      this.loadingService.loadingOff();
      console.log(e);
      return;
    }
  }
  /**地區報表匯出 API*/
  getExportLocation(sd: string, ed: string) {
    try {
      let SD = sd;
      let ED = ed;
      const request = {
        subId: this.subId,
        startDate: SD,
        endDate: ED,
      };
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/ReportExport/ReportExportLocation`;
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            let data = res as BaseResponse;
            if (data.data.length > 0) {
              data.data as exportData;
              console.log(data.data);
              let tmpD: ExportReportModel = {
                reportName: "地區成效",
                tableId: "",
                colNameList: [
                  { colValue: colMapping.locationTitle, colSta: true, width: "auto" },
                  { colValue: colMapping.impression, colSta: true, width: "auto" },
                  { colValue: colMapping.click, colSta: true, width: "auto" },
                  { colValue: colMapping.ctr, colSta: true, width: "auto" },
                  { colValue: colMapping.cpc, colSta: true, width: "auto" },
                  { colValue: colMapping.cost, colSta: true, width: "auto" },
                ],
                colValueList: [],
                totalList: []
              }
              data.data.forEach((x: exportData) => {
                tmpD.colValueList.push({ tdList: [] });
              });
              data.data.forEach((y: exportData, index: number) => {
                /**TODO 前端先處理  後端要改DB資料 */
                y.cost = y.cost / 1000000;
                y.ctr = this.ctrCount(y.click, y.impressions);
                y.cpc = Number(this.cpcCount(y.cost, y.click));

                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.location, colSta: true },
                  { colValue: y.impressions, colSta: true },
                  { colValue: y.click, colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc), colSta: true },
                  { colValue: this.twFormat(y.cost), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = Number(this.cpcCount(this.costTotal, this.clickTotal));
              tmpD.totalList.push(
                { colValue: "總計", colSta: true },
                { colValue: `${this.impressTotal}`, colSta: true },
                { colValue: `${this.clickTotal}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal), colSta: true },
                { colValue: this.twFormat(this.costTotal), colSta: true },
              )

              this.exportDataList.push(tmpD);
            } else {
              this.messageService.add({ severity: 'error', summary: '錯誤', detail: '查無地區成效報表資訊!' })
            }
            console.log(this.exportDataList);
            this.loadingService.loadingOff();
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            this.loadingService.loadingOff();
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
  /**每日或每周報表匯出API */
  getExportDayOrWeek(sd: string, ed: string, type: string) {
    try {
      let SD = sd;
      let ED = ed;
      let staBoth = ["Day", "Week"];
      let staDay = ["Day"];
      let staWeek = ["Week"];
      const request = {
        subId: this.subId,
        status: [""],
        startDate: SD,
        endDate: ED,
      };
      switch (type) {
        case "Day":
          request.status = staDay;
          break;
        case "Week":
          request.status = staWeek;
          break;
        case "DayOrWeek":
          request.status = staBoth;
          break;
        default:
          break;
      }
      let typeStr = type == "Day" ? "每日報表" : "每周報表";
      let rD = JSON.stringify(request);
      const qryDataUrl = environment.apiServiceHost + `api/ReportExport/ReportExportWithWeekOrDay`;
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            let data = res as BaseResponse;
            if (data.data.length > 0) {
              data.data as exportData;
              console.log(data.data);
              let tmpD: ExportReportModel = {
                reportName: type == "Day" ? "每日報表" : "每周報表",
                tableId: "",
                colNameList: [
                  { colValue: colMapping.date, colSta: true, width: "auto" },
                  { colValue: colMapping.impression, colSta: true, width: "auto" },
                  { colValue: colMapping.click, colSta: true, width: "auto" },
                  { colValue: colMapping.ctr, colSta: true, width: "auto" },
                  { colValue: colMapping.cpc, colSta: true, width: "auto" },
                  { colValue: colMapping.cost, colSta: true, width: "auto" },
                ],
                colValueList: [],
                totalList: []
              }
              data.data.forEach((x: exportData) => {
                tmpD.colValueList.push({ tdList: [] });
              });
              data.data.forEach((y: exportData, index: number) => {
                /**TODO 前端先處理  後端要改DB資料 */
                y.cost = y.cost / 1000000;
                y.ctr = this.ctrCount(y.click, y.impressions);
                y.cpc = Number(this.cpcCount(y.cost, y.click));

                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.date, colSta: true },
                  { colValue: y.impressions, colSta: true },
                  { colValue: y.click, colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc), colSta: true },
                  { colValue: this.twFormat(y.cost), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = Number(this.cpcCount(this.costTotal, this.clickTotal));
              tmpD.totalList.push(
                { colValue: "總計", colSta: true },
                { colValue: `${this.impressTotal}`, colSta: true },
                { colValue: `${this.clickTotal}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal), colSta: true },
                { colValue: this.twFormat(this.costTotal), colSta: true },
              )

              this.exportDataList.push(tmpD);
            } else {
              this.messageService.add({ severity: 'error', summary: '錯誤', detail: `查無${typeStr}報表資訊!` })
            }
            this.loadingService.loadingOff();
            resolve();
          },
          error: (error: HttpErrorResponse) => {
            console.log(error.error);
            this.loadingService.loadingOff();
            reject();
          }
        });
      })
    }
    catch (e: any) {
      console.log(e);
      this.loadingService.loadingOff();
      return;
    }
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
                if (x.contentId == "repCon00015") {
                  this.isKwEnable = true;
                }
                this.dataList.push(this.formBuilder.group({
                  sta: false,
                  Id: x.reportNo,
                  reportName: x.contentName,
                  contentId: x.contentId,
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
}

