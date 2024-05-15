import { CdkDragDrop, moveItemInArray, CdkDropList, CdkDrag, transferArrayItem, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { repColListModel } from '../report-manage.models';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, NgClass } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-set-column-pop',
    templateUrl: './set-column-pop.component.html',
    styleUrls: ['./set-column-pop.component.css'],
    standalone: true,
    imports: [MatIconModule, MatCheckboxModule, ReactiveFormsModule, FormsModule, MatChipsModule, CdkDropList, NgFor,CdkDropListGroup, CdkDrag, NgClass, MatButtonModule]
})
export class SetColumnPopComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SetColumnPopComponent>,
    @Inject(MAT_DIALOG_DATA) public inPutdata: any,
  ) { }
  contentName:string = "";
  tList: repColListModel[] = [];
  fList: repColListModel[] = [];
  trueChkBox = false;
  falseChkBox = false;

  ngOnInit(): void {
    this.tList = JSON.parse(this.inPutdata.tureList);
    this.tList.forEach(x=>{
      x.colStatus = false;
    })
    this.fList = JSON.parse(this.inPutdata.falseList);
    this.contentName = this.inPutdata.conName;
  }

  /**欄位拖移 */
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }
  isClick(data:repColListModel){
    if(data.colStatus){
      data.colStatus = false;
    }else{
      data.colStatus = true;
    }
  }
  arrowRight(){
    this.trueChkBox = false;
    this.tList=this.tList.filter(x=> {
      if (x.colStatus) {
        this.fList.push({
          colName:x.colName, colStatus:false
        });
        return false;
      }
      return true;
    })
  }
  arrowLeft(){
    this.falseChkBox = false;
    this.fList=this.fList.filter(x=> {
      if (x.colStatus) {
        this.tList.push({
          colName:x.colName, colStatus:false
        });
        return false;
      }
      return true;
    })
  }
  onOk(): void {
    this.tList.forEach(x=>{
      x.colStatus = true;
    });
    this.fList.forEach(x=>{
      x.colStatus = false;
    });
    this.dialogRef.close({ data: { tureList: JSON.stringify(this.tList), falseList: JSON.stringify(this.fList)} });
  }
  onCancel(): void {
    this.dialogRef.close({ data: false });
  }

  trueChkAll(sta:any){
    console.log(sta);
    if(sta.checked){
      this.tList.forEach(x=>{
        x.colStatus = true;
      })
    }else{
      this.tList.forEach(x=>{
        x.colStatus = false;
      })
    }
  }
  falseChkAll(sta:any){
    if(sta.checked){
      this.fList.forEach(x=>{
        x.colStatus = true;
      })
    }else{
      this.fList.forEach(x=>{
        x.colStatus = false;
      })
    }
  }

}
