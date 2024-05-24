import { CommonService } from 'src/app/share/service/common.service';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { DatePipe, NgFor, NgIf, NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from "xlsx-js-style";
import { BaseResponse } from 'src/app/share/Models/share.model';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { exportSampleModels, getReportDetailRes } from '../report-manage.models';
import { ExportReportModel, colMapping, dateRangeModel, exportData, exportDataList } from './report-export-pop.model';
import '../../../../assets/msjh-normal.js';
import { MessageService } from 'primeng/api';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { CdkDropList, CdkDrag, CdkDragDrop, CdkDragPreview, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from '../../../share/loading/loading.component';
import { ApiService } from 'src/app/share/service/api.service';
import { LoadingService } from 'src/app/share/service/loading.service';
import { tap } from 'rxjs';


@Component({
  selector: 'app-report-export-pop',
  templateUrl: './report-export-pop.component.html',
  styleUrls: ['./report-export-pop.component.css'],
  standalone: true,
  imports: [LoadingComponent, ToastModule, MatIconModule, MatStepperModule, ReactiveFormsModule, MatCheckboxModule, NgFor, NgIf, MatFormFieldModule, MatDatepickerModule, MatChipsModule, CdkDropList, CdkDrag, CdkDragPreview, MatButtonModule, FormsModule, NgClass, MatMenuModule]
})
//報表匯出
export class ReportExpotPopComponent implements AfterViewInit, OnInit {
  constructor(
    public dialogRef: MatDialogRef<ReportExpotPopComponent>, @Inject(MAT_DIALOG_DATA) public inPutdata: exportSampleModels,
    public datePipe: DatePipe, private formBuilder: FormBuilder, public apiService: ApiService,
    public loadingService: LoadingService, private messageService: MessageService, private CommonSvc: CommonService) { }

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
  exportData: ExportReportData[] = [];
  exportDataList: ExportReportModel[] = [];
  impressTotal: number = 0;
  clickTotal: number = 0;
  ctrTotal: string = "";
  cpcTotal: number = 0;
  costTotal: number = 0;
  pos: any;
  release: boolean = true;
  /**總比數 */
  tableCount = 0;
  /**報表名稱 */
  subClientName: string = "";
  /**是否顯示 關鍵字 footer */
  isKwEnable: boolean = false;

  async ngAfterViewInit(): Promise<void> {
    await this.getReportDetail(this.colId);
  }
  async ngOnInit(): Promise<void> {
    this.colId = this.inPutdata.columnID;
    this.subId = this.inPutdata.subID;
    this.subClientName = this.inPutdata.subClientName;
  }
  //有勾選到的報表內容要給必填日期
  onCheckExport(value: any, data: any) {
    data.controls['dateRangePickList'].setValue([
      { name: "今日", value: "D" },
      { name: "過去七天", value: "L7W" },
      { name: "本周", value: "W" },
      { name: "上個月", value: "LM" },
      { name: "本月", value: "M" },
    ])
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
  //日期快速篩選
  dateRangeClick(chip: dateRangeModel, data: any) {
    let today = new Date();
    switch (chip.value) {
      case "D":
        data.controls['SD'].setValue(new Date());
        data.controls['ED'].setValue(new Date());
        break;
      case "W":
        let firstWeekDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1));
        let lastWeekDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (7 - today.getDay()));
        //如果第一天跨月，把當月的第一天當本周的第一天
        if (firstWeekDay.getMonth() !== today.getMonth()) {
          firstWeekDay = new Date(today.getFullYear(), today.getMonth(), 1);
        }
        //如果最後一天跨月，把當月的最後一天當本周的最後一天
        if (lastWeekDay.getMonth() == today.getMonth() + 1) {
          lastWeekDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        }
        data.controls['SD'].setValue(firstWeekDay);
        data.controls['ED'].setValue(lastWeekDay);
        break;
      case "L7W":
        let firstLastWeekDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
        let lastLastWeekDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
        data.controls['SD'].setValue(firstLastWeekDay);
        data.controls['ED'].setValue(lastLastWeekDay);
        break;
      case "M":
        let firstMonDay = new Date(today.getFullYear(), today.getMonth(), 1);
        let lastMonDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        data.controls['SD'].setValue(firstMonDay);
        data.controls['ED'].setValue(lastMonDay);
        break;
      case "LM":
        let firstLastMonDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        let lastLastMonDay = new Date(today.getFullYear(), today.getMonth() - 1 + 1, 0);
        data.controls['SD'].setValue(firstLastMonDay);
        data.controls['ED'].setValue(lastLastMonDay);
        break;
      default:
        return;
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
      } else {
        this.messageService.add({ severity: 'warn', summary: '提醒', detail: '尚未勾選報表' })
      }
    }
  }
  /**匯出PDF */
  async exportPdf() {
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
    let fileName = `${this.subClientName}報表.pdf`
    doc.save(fileName);
  }
  /**單筆匯出PDF */
  async exportSinglePdf(table: ExportReportModel) {
    const doc = new jsPDF("p", "pt", "a4")
    doc.setFont('msjh');
    doc.text('汎古數位媒體行銷股份有限公司', 14, 20)
    autoTable(doc, {
      html: `#${table.tableId}`,
      tableWidth: 'auto',
      useCss: true,
      styles: {
        font: "msjh"
      }
    })
    let fileName = `${this.subClientName}_${table.reportName}.pdf`
    doc.save(fileName);
  }
  mouseDown(event: any, el: any = null) {
    el = el || event.target;
    this.pos = {
      x: el.getBoundingClientRect().left - event.clientX + "px",
      y: el.getBoundingClientRect().top - event.clientY + "px",
      width: el.getBoundingClientRect().width + "px"
    };
  }
  dropTable(event: CdkDragDrop<any[]>, tableId: any) {
    let totalData = this.exportDataList.find(x => x.tableId == tableId);
    const data = this.exportDataList.find(x => x.tableId == tableId)?.colNameList;
    const footerData = this.exportDataList.find(x => x.tableId == tableId)?.totalList;
    if (data && footerData) {
      if (event.previousContainer === event.container) {
        //更改 內容
        totalData?.colValueList.forEach(x => {
          moveItemInArray(x.tdList, event.previousIndex, event.currentIndex);
        })
        //更改 總計列 #TODO如果是關鍵字要判斷不給移，因為她總計是獨立的
        moveItemInArray(footerData, event.previousIndex, event.currentIndex);
        //更改 Title列
        moveItemInArray(data, event.previousIndex, event.currentIndex);
      } else {
        // Move items between lists
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }
  }

  /** 匯出EXCEL報表 */
  exportExcel() {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    try {
      this.exportDataList.forEach(x => {
        let lastRow = -1;
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
          //保留百分比
          if (typeof ws[i].v === 'number' && ws[i].v >= 0 && ws[i].v < 1 && ws[i].v % 1 !== 0) {
            ws[i].z = '0.00%'
          }
          if (typeof ws[i].v === 'number' && !ws[i].z) {
            ws[i].z = '#,##0'
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
      let fileName = `${this.subClientName}報表.xlsx`
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.log(e);
    }
  }
  /** 單筆匯出EXCEL報表 */
  exportSingleExcel(table: ExportReportModel) {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    try {
      let lastRow = -1;
      var excelTable = document.getElementById(table.tableId);
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
        //保留百分比
        if (typeof ws[i].v === 'number' && ws[i].v >= 0 && ws[i].v < 1 && ws[i].v % 1 !== 0) {
          ws[i].z = '0.00%'
        }
        if (typeof ws[i].v === 'number' && !ws[i].z) {
          ws[i].z = '#,##0'
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
      XLSX.utils.book_append_sheet(wb, ws, table.reportName);
      let fileName = `${this.subClientName}_${table.reportName}.xlsx`
      XLSX.writeFile(wb, fileName);
    } catch (e) {
      console.log(e);
    }
  }
  onCancel(): void {
    this.dialogRef.close({ data: false });
  }
  //數值轉換台幣
  twFormat(coin: number, type: string): string {
    coin = Math.round((coin / 1000000) * 100) / 100;
    const twFormat = new Intl.NumberFormat('zh-TW', {
      style: 'currency',
      currency: 'TWD'
    });
    let res = twFormat.format(+coin.toFixed(2));
    //費用去除00
    if (type == "cost") {
      res = res.replace(/\.\d{2}$/, '');
    }
    return res;
  }
  //點閱率計算
  ctrCount(click: number, impression: number): string {
    let res = (click / impression) * 100;
    return res.toFixed(2) + '%';
  }
  //cpc計算
  cpcCount(cost: number, click: number): number {
    let res = cost / click;
    return res;
  }
  //把每張報表設定ID
  setTableId() {
    return new Promise<void>((resolve, reject) => {
      for (let i = 0; i < this.exportDataList.length; i++) {
        this.exportDataList[i].tableId = `table_${i}`;
      }
      resolve();
    });
  }
  setTotalToZero() {
    this.impressTotal = 0;
    this.clickTotal = 0;
    this.costTotal = 0;
    this.ctrTotal = '';
    this.cpcTotal = 0;
  }

  exportReportCalled: boolean = false;
  /**匯出報表方法 */
  getExportReport() {
    return new Promise<void>(async (resolve, reject) => {
      for (const x of this.dataList.controls) {
        this.loadingService.loadingOn();
        if (x.value.sta == true) {
          this.setTotalToZero();
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
                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.gender, colSta: true },
                  { colValue: y.impressions.toLocaleString(), colSta: true },
                  { colValue: y.click.toLocaleString(), colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc, 'cpc'), colSta: true },
                  { colValue: this.twFormat(y.cost, 'cost'), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = this.cpcCount(this.costTotal, this.clickTotal);
              this.costTotal = this.cpcTotal * this.clickTotal;
              tmpD.totalList.push(
                { colValue: "總計", colSta: true },
                { colValue: `${this.impressTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.clickTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal, 'cpc'), colSta: true },
                { colValue: this.twFormat(this.costTotal, 'cost'), colSta: true },
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
                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.age, colSta: true },
                  { colValue: y.impressions.toLocaleString(), colSta: true },
                  { colValue: y.click.toLocaleString(), colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc, 'cpc'), colSta: true },
                  { colValue: this.twFormat(y.cost, 'cost'), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = this.cpcCount(this.costTotal, this.clickTotal);
              this.costTotal = this.cpcTotal * this.clickTotal;
              tmpD.totalList.push(
                { colValue: "總計", colSta: true },
                { colValue: `${this.impressTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.clickTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal, 'cpc'), colSta: true },
                { colValue: this.twFormat(this.costTotal, 'cost'), colSta: true },
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
              let tmpD: ExportReportModel = {
                reportName: "關鍵字成效",
                tableId: "",
                colNameList: [
                  { colValue: colMapping.kwCampaignName, colSta: true, width: "auto" },
                  { colValue: colMapping.kwAdGroupName, colSta: true, width: "auto" },
                  { colValue: colMapping.kwColSrchKeyWord, colSta: true, width: "auto" },
                  { colValue: colMapping.matchType, colSta: true, width: "auto" },
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
                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.campaignName, colSta: true },
                  { colValue: y.adGroupName, colSta: true },
                  { colValue: y.colSrchKeyWord, colSta: true },
                  { colValue: y.matchType, colSta: true },
                  { colValue: y.impressions.toLocaleString(), colSta: true },
                  { colValue: y.click.toLocaleString(), colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc, 'cpc'), colSta: true },
                  { colValue: this.twFormat(y.cost, 'cost'), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = this.cpcCount(this.costTotal, this.clickTotal);
              this.costTotal = this.cpcTotal * this.clickTotal;
              tmpD.totalList.push(
                { colValue: `${this.impressTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.clickTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal, 'cpc'), colSta: true },
                { colValue: this.twFormat(this.costTotal, 'cost'), colSta: true },
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
                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.location, colSta: true },
                  { colValue: y.impressions.toLocaleString(), colSta: true },
                  { colValue: y.click.toLocaleString(), colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc, 'cpc'), colSta: true },
                  { colValue: this.twFormat(y.cost, 'cost'), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = this.cpcCount(this.costTotal, this.clickTotal);
              this.costTotal = this.cpcTotal * this.clickTotal;
              tmpD.totalList.push(
                { colValue: "總計", colSta: true },
                { colValue: `${this.impressTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.clickTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal, 'cpc'), colSta: true },
                { colValue: this.twFormat(this.costTotal, 'cost'), colSta: true },
              )

              this.exportDataList.push(tmpD);
            } else {
              this.messageService.add({ severity: 'error', summary: '錯誤', detail: '查無地區成效報表資訊!' })
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
                this.impressTotal += y.impressions;
                this.clickTotal += y.click;
                this.costTotal += y.cost;

                tmpD.colValueList[index].tdList.push(
                  { colValue: y.date, colSta: true },
                  { colValue: y.impressions.toLocaleString(), colSta: true },
                  { colValue: y.click.toLocaleString(), colSta: true },
                  { colValue: y.ctr, colSta: true },
                  { colValue: this.twFormat(y.cpc, 'cpc'), colSta: true },
                  { colValue: this.twFormat(y.cost, 'cost'), colSta: true },
                )
              })
              this.ctrTotal = this.ctrCount(this.clickTotal, this.impressTotal);
              this.cpcTotal = this.cpcCount(this.costTotal, this.clickTotal);
              this.costTotal = this.cpcTotal * this.clickTotal;
              tmpD.totalList.push(
                { colValue: "總計", colSta: true },
                { colValue: `${this.impressTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.clickTotal.toLocaleString()}`, colSta: true },
                { colValue: `${this.ctrTotal}`, colSta: true },
                { colValue: this.twFormat(this.cpcTotal, 'cpc'), colSta: true },
                { colValue: this.twFormat(this.costTotal, 'cost'), colSta: true },
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
      return new Promise<void>((resolve, reject) => {
        this.apiService.CallApi(qryDataUrl, 'POST', rD).subscribe({
          next: (res) => {
            var data = res as BaseResponse;
            let repColList: getReportDetailRes[];
            repColList = data.data;
            if (repColList.length != 0) {
              this.dataList.setValue([]);
              repColList.forEach(x => {
                if (x.contentId == "repCon00015") {
                  this.isKwEnable = true;
                }
                this.dataList.push(this.formBuilder.group<exportDataList>({
                  sta: false,
                  Id: x.reportNo,
                  reportName: x.contentName,
                  contentId: x.contentId,
                  SD: '',
                  ED: '',
                  dateRangePickList: []
                }));
              })
            } else {
              this.messageService.add({ severity: 'warn', summary: '提醒', detail: '請到編輯報表選擇報表內容!' })
            }
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
    }
  }

}

