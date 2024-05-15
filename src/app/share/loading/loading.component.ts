import { Component } from '@angular/core';
import { NgIf, AsyncPipe } from '@angular/common';
import { LoadingService } from '../service/loading.service';

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
