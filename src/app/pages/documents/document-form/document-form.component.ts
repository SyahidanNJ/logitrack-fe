import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-document-form',
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.scss'],
  standalone: false
})
export class DocumentFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  transactions: any[] = [];
  
  constructor(private fb: FormBuilder, private api: RestApiService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      doc_type: ['', Validators.required],
      reference_id: ['', Validators.required]
    });

    this.form.get('doc_type')?.valueChanges.subscribe(val => {
      this.form.patchValue({ reference_id: '' });
      if (val) {
        this.fetchTransactions(val);
      } else {
        this.transactions = [];
      }
    });
  }

  fetchTransactions(type: string): void {
    this.loading = true;
    const endpoint = type === 'CHECK_IN' ? 'check-ins' : 'check-outs';
    this.api.get(endpoint).subscribe({
      next: (res) => {
        this.transactions = res.data || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    
    this.api.post('documents', this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        Swal.fire('Success', 'Document Generated!', 'success').then(() => this.saved.emit());
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', err.error?.message || 'Failed to generate', 'error');
      }
    });
  }
}
