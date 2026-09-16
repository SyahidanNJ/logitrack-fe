import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-zone-list',
  templateUrl: './zone-list.component.html',
  styleUrls: ['./zone-list.component.scss'],
  standalone: false
})
export class ZoneListComponent implements OnInit {
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
    this.api.get('zones').subscribe({
      next: (res) => {
        this.items = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load zones', 'error');
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
        this.api.delete(`zones/${id}`).subscribe({
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
    const modalEl = document.getElementById('zoneModal');
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
