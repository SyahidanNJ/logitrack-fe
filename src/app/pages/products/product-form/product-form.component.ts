import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: false
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() itemId: number | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  submitted = false;
  isEdit = false;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: RestApiService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemId']) {
      this.submitted = false;
      if (this.itemId) {
        this.isEdit = true;
        if (this.form) this.loadItem();
      } else {
        this.isEdit = false;
        if (this.form) this.form.reset();
      }
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      sku: ['', Validators.required], 
      name: ['', Validators.required], 
      category: [''], 
      unit: ['pcs']
    });
  }

  loadItem(): void {
    this.api.get(`products/${this.itemId}`).subscribe({
      next: (res) => { if (res.data) this.form.patchValue(res.data); },
      error: () => Swal.fire('Error', 'Failed to fetch data', 'error')
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    const payload = this.form.value;
    const request$ = this.isEdit ? this.api.put(`products/${this.itemId}`, payload) : this.api.post('products', payload);

    request$.subscribe({
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
