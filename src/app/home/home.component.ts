import { Component, OnInit } from '@angular/core';
import { MatDrawerToggleResult, MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    // 在這裡獲取路由參數
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const scope = params['scope'];

      // 在這裡處理獲取的值
      console.log('Code:', code);
      console.log('Scope:', scope);
    });
  }

  toggleSideNav(sideNav: MatSidenav) {
    sideNav.toggle().then((result: MatDrawerToggleResult) => {
      console.log(result);
      console.log(`選單狀態：${result}`);
    });
  }
}
