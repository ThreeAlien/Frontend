import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'app-aside',
    templateUrl: './aside.component.html',
    styleUrls: ['./aside.component.css'],
    standalone: true,
    imports: [
        MatListModule,
        MatButtonModule,
        RouterLink,
    ],
})
export class AsideComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
