import { Component, OnInit, OnDestroy } from '@angular/core';
import { LogitrackAuthService } from '../../core/services/logitrack-auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
  standalone: false
})
export class TopbarComponent implements OnInit, OnDestroy {
  user: any;
  mottos: string[] = [
    "Smart Warehouse Management",
    "Streamlining Logistics Operations",
    "Optimizing Inventory Control",
    "Driving Supply Chain Excellence"
  ];
  currentMotto: string = this.mottos[0];
  fadeMotto: boolean = false;
  private intervalId: any;

  constructor(private authService: LogitrackAuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    let index = 0;
    this.intervalId = setInterval(() => {
      this.fadeMotto = true;
      setTimeout(() => {
        index = (index + 1) % this.mottos.length;
        this.currentMotto = this.mottos[index];
        this.fadeMotto = false;
      }, 500);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  logout() {
    this.authService.logout();
  }
}
