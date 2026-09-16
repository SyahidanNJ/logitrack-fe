import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-check-out-form',
  templateUrl: './check-out-form.component.html',
  styleUrls: ['./check-out-form.component.scss'],
  standalone: false
})
export class CheckoutFormComponent implements OnInit, OnChanges {
  @Input() itemId: number | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  submitted = false;
  loading = false;
  isEditMode = false;
  selectedFile: File | null = null;
  
  products: any[] = [];

  constructor(
    private fb: FormBuilder,
    private api: RestApiService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemId']) {
      this.submitted = false;
      if (this.itemId) {
        this.isEditMode = true;
        if (this.form) this.fetchData();
      } else {
        this.isEditMode = false;
        if (this.form) this.form.reset();
      }
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      product_id: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      strategy: ['FIFO', Validators.required],
      destination: [''],
      document_number: [''],
      notes: ['']
    });

    this.api.get('products').subscribe(res => {
      this.products = res.data || [];
    });

    if (this.itemId) {
      this.isEditMode = true;
      this.fetchData();
    }
  }

  fetchData(): void {
    this.loading = true;
    this.api.get(`check-outs/${this.itemId}`).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.data) {
          this.form.patchValue(res.data);
        }
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Failed to fetch check-out data', 'error').then(() => this.saved.emit());
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    
    const formData = new FormData();
    Object.keys(this.form.value).forEach(key => {
      if (this.form.value[key] !== null && this.form.value[key] !== undefined) {
        formData.append(key, this.form.value[key]);
      }
    });
    
    if (this.selectedFile) {
      formData.append('document_file', this.selectedFile);
    }

    const request = this.isEditMode 
      ? this.api.put(`check-outs/${this.itemId}`, formData)
      : this.api.post('check-outs', formData);

    request.subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status) {
          Swal.fire('Success', res.message || 'Saved', 'success').then(() => this.saved.emit());
        } else {
          Swal.fire('Error', res.message, 'error');
        }
      },
      error: (err) => {
        this.loading = false;
        Swal.fire('Error', err.error?.message || 'Operation failed', 'error');
      }
    });
  }
}
