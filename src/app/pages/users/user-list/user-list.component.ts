import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: false
})
export class UserListComponent implements OnInit {
  users: any[] = [];
  loading = false;
  selectedId: number | null = null;
  modalInstance: any;

  constructor(private api: RestApiService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.api.get('users').subscribe({
      next: (res) => {
        if (res.status && res.data) {
          this.users = res.data;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  deleteUser(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will remove the user from LogiTrack and Employee DB!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete(`users/${id}`).subscribe({
          next: (res) => {
            if (res.status) {
              Swal.fire('Deleted!', 'User has been deleted.', 'success');
              this.fetchUsers();
            }
          },
          error: (err) => {
            Swal.fire('Error', 'Failed to delete user', 'error');
          }
        });
      }
    });
  }

  openModal(id: number | null = null) {
    this.selectedId = id;
    const modalEl = document.getElementById('userModal');
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
    if (this.fetchUsers) {
      this.fetchUsers();
    } else {
      this.ngOnInit();
    }
  }
}
