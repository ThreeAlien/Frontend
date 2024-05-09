import { Component } from '@angular/core';
import { LoadingService } from 'src/app/service/loading.service';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css'],
    standalone: true,
    imports: [NgIf, AsyncPipe]
})
export class LoadingComponent {
  constructor(public loadingService: LoadingService){}
}
