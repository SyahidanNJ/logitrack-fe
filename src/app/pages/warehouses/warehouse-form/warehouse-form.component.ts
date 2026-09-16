import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-warehouse-form',
  templateUrl: './warehouse-form.component.html',
  styleUrls: ['./warehouse-form.component.scss'],
  standalone: false
})
export class WarehouseFormComponent implements OnInit, OnChanges {
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

  ngOnInit(): void {
    this.form = this.fb.group({
      code: ['', [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      address: ['']
    });
  }

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

  get f() { return this.form.controls; }

  loadItem(): void {
    this.api.get(`warehouses/${this.itemId}`).subscribe({
      next: (res) => {
        if (res.data) {
          this.form.patchValue(res.data);
        }
      },
      error: () => Swal.fire('Error', 'Failed to fetch data', 'error')
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) return;

    this.loading = true;
    const payload = this.form.value;
    const request$ = this.isEdit 
      ? this.api.put(`warehouses/${this.itemId}`, payload)
      : this.api.post('warehouses', payload);

    request$.subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status) {
          Swal.fire('Success', res.message, 'success').then(() => {
            this.saved.emit();
          });
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
