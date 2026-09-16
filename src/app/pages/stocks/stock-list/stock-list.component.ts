import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.scss'],
  standalone: false
})
export class StockListComponent implements OnInit {
  items: any[] = [];
  loading = false;

  constructor(private api: RestApiService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.api.get('stocks').subscribe({
      next: (res) => {
        this.items = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load stocks', 'error');
      }
    });
  }
}
