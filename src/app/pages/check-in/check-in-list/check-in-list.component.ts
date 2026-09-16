import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-check-in-list',
  templateUrl: './check-in-list.component.html',
  styleUrls: ['./check-in-list.component.scss'],
  standalone: false
})
export class CheckinListComponent implements OnInit {
  items: any[] = [];
  loading = false;
  selectedId: number | null = null;
  modalInstance: any;

  constructor(private api: RestApiService) { }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.api.get('check-ins').subscribe({
      next: (res) => {
        this.items = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load check-ins', 'error');
      }
    });
  }

  deleteItem(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete(`check-ins/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Record has been deleted.', 'success');
            this.fetchData();
          },
          error: (err) => Swal.fire('Error', err.error?.message || 'Delete failed', 'error')
        });
      }
    });
  }

  openModal(id: number | null = null) {
    this.selectedId = id;
    const modalEl = document.getElementById('check-inModal');
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
    if (this.fetchData) {
      this.fetchData();
    } else {
      this.ngOnInit();
    }
  }
}
