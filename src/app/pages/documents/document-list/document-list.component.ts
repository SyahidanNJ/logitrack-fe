import { Component, OnInit } from '@angular/core';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  standalone: false
})
export class DocumentListComponent implements OnInit {
  documents: any[] = [];
  loading = false;
  showForm = false;

  constructor(private api: RestApiService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.loading = true;
    this.api.get('documents').subscribe({
      next: (res) => {
        this.documents = res.data || [];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  deleteDoc(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.api.delete(`documents/${id}`).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Document has been deleted.', 'success');
            this.fetchData();
          },
          error: (err) => {
            Swal.fire('Error!', err.error?.message || 'Failed to delete', 'error');
          }
        });
      }
    });
  }
}
