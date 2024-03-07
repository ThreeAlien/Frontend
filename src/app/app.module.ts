import { TopComponent } from './home/top/top.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ReportManageComponent } from './page/report-manage/report-manage.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AsideComponent } from './home/aside/aside.component';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MsgBoxComponent } from './share/msg-box/msg-box.component';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReportExpotPopComponent } from './page/report-manage/report-export-pop/report-export-pop.component';
import { SetColumnPopComponent } from './page/report-manage/set-column-pop/set-column-pop.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { SSOJumpComponent } from './ssojump/ssojump.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { AddRepExmplePopComponent } from './page/report-manage/add-rep-exmple-pop/add-rep-exmple-pop.component';
import { ClientManageComponent } from './page/client-manage/client-manage.component';
import { TableModule } from 'primeng/table';
import { MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: "YYYY-MM-DD"//display值出來後轉的值
  },
  display: {
    dateInput: "YYYY/MM/DD",//畫面顯示
    monthYearLabel: "YYYY MM",//日曆左上角顯示
    dateA11yLabel: "YYYY/MM/DD",//輔助開發者顯示標記用
    monthYearA11yLabel: "YYYY/MM/DD"//輔助開發者顯示標記用
  }
};
@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatMenuModule,
    MatCardModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    CdkDrag,
    CdkDropList,
    ButtonModule,
    HttpClientModule,
    MatCheckboxModule,
    ToastModule,
    TableModule,
    MatNativeDateModule,
    MatInputModule,
    MomentDateModule,
    MatDatepickerModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ReportManageComponent,
    AddRepExmplePopComponent,
    HomeComponent,
    AsideComponent,
    TopComponent,
    MsgBoxComponent,
    ReportExpotPopComponent,
    SetColumnPopComponent,
    SSOJumpComponent,
    ClientManageComponent
  ],
  bootstrap: [AppComponent],
  providers: [
    DatePipe,
    MessageService,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
