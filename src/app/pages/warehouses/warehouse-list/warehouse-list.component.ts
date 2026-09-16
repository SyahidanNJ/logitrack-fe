import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-warehouse-list',
  templateUrl: './warehouse-list.component.html',
  styleUrls: ['./warehouse-list.component.scss'],
  standalone: false
})
export class WarehouseListComponent implements OnInit {
  warehouses: any[] = [];
  loading = false;
  selectedId: number | null = null;
  modalInstance: any;

  constructor(private api: RestApiService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.api.get('warehouses').subscribe({
      next: (res) => {
        this.warehouses = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load warehouses', 'error');
      }
    });
  }

  deleteItem(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete(`warehouses/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Record has been deleted.', 'success');
            this.fetchData();
          },
          error: () => Swal.fire('Error', 'Failed to delete record', 'error')
        });
      }
    });
  }

  openModal(id: number | null = null) {
    this.selectedId = id;
    const modalEl = document.getElementById('warehouseModal');
    if (modalEl) {
      this.modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
      this.modalInstance.show();
    }
  }

  closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  onSaved() {
    this.closeModal();
    this.fetchData();
  }
}
