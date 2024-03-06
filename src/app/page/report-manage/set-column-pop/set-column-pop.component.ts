import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MsgBoxService } from 'src/app/service/msg-box.service';
import { repColListModel } from '../report-manage.models';

@Component({
  selector: 'app-set-column-pop',
  templateUrl: './set-column-pop.component.html',
  styleUrls: ['./set-column-pop.component.css']
})
export class SetColumnPopComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SetColumnPopComponent>,
    @Inject(MAT_DIALOG_DATA) public inPutdata: any,
    private msgBoxService: MsgBoxService) { }

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
  }

  /**欄位拖移 */
  drop(event: CdkDragDrop<[]>) {
    //moveItemInArray(this.vegetables, event.previousIndex, event.currentIndex);
  }
  isClick(data:repColListModel){
    if(data.colStatus){
      data.colStatus = false;
    }else{
      data.colStatus = true;
    }
  }
  arrowRight(){
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
