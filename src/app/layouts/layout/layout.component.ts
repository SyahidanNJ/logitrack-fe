import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: false
})
export class LayoutComponent {
  isPrintMode = false;

  constructor(private router: Router) {
    this.checkPrintMode(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.checkPrintMode(event.urlAfterRedirects);
    });
  }

  checkPrintMode(url: string) {
    this.isPrintMode = url.includes('/documents/print');
  }
}
