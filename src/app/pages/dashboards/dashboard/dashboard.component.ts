import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../core/services/rest-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  stats: any = {
    totalProducts: 0,
    totalWarehouses: 0,
    totalZones: 0,
    totalStocks: 0,
    totalCheckIns: 0,
    totalCheckOuts: 0,
    recentMovements: [],
    lowStocks: []
  };
  loading = false;

  constructor(private api: RestApiService) {}

  ngOnInit(): void {
    this.fetchStats();
  }

  fetchStats(): void {
    this.loading = true;
    this.api.get('dashboard').subscribe({
      next: (res) => {
        if (res.status && res.data) {
          this.stats = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
