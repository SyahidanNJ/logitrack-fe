import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestApiService } from '../../../core/services/rest-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: false
})
export class UserFormComponent implements OnInit, OnChanges {
  @Input() itemId: number | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  isEdit = false;
  userId: number | null = null;
  loading = false;
  submitted = false;
  employees: any[] = [];
  filteredEmployees: any[] = [];
  nikSearchText = '';
  showNikDropdown = false;

  constructor(
    private fb: FormBuilder,
    private api: RestApiService,
    
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['itemId']) {
      this.submitted = false;
      if (this.itemId) {
        this.isEdit = true;
        if (this.form) this.loadUser();
      } else {
        this.isEdit = false;
        if (this.form) this.form.reset();
        this.nikSearchText = '';
      }
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      nik: ['', [Validators.required, Validators.maxLength(20)]],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.email]],
      department: [''],
      role: ['admin', Validators.required],
      is_active: [true]
    });

    
    this.isEdit = !!this.itemId;

    if (this.isEdit) {
      // In edit mode, NIK is usually not editable
      this.form.get('nik')?.disable();
      this.loadUser();
    } else {
      this.loadEmployees();
    }
  }

  loadEmployees(): void {
    this.api.get('users/employees/all').subscribe({
      next: (res) => {
        if (res.status) {
          this.employees = res.data;
          this.filteredEmployees = [...this.employees];
        }
      }
    });
  }

  onNikSearch(event: any): void {
    this.nikSearchText = event.target.value;
    const search = this.nikSearchText.toLowerCase();
    this.filteredEmployees = this.employees.filter(e => 
      e.nik.toLowerCase().includes(search) || e.name.toLowerCase().includes(search)
    );
    this.showNikDropdown = true;
  }

  selectEmployee(emp: any): void {
    this.nikSearchText = `${emp.nik} - ${emp.name}`;
    this.form.patchValue({
      nik: emp.nik,
      name: emp.name,
      email: emp.email,
      department: emp.department || '',
      role: emp.role || 'admin'
    });
    this.showNikDropdown = false;
  }

  onNikBlur(): void {
    this.showNikDropdown = false;
  }

  get f() {
    return this.form.controls;
  }

  loadUser(): void {
    this.loading = true;
    this.api.get(`users/${this.itemId}`).subscribe({
      next: (res) => {
        if (res.status && res.data) {
          this.form.patchValue({
            nik: res.data.nik,
            name: res.data.name,
            email: res.data.email,
            department: res.data.department,
            role: res.data.role,
            is_active: res.data.is_active
          });
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        Swal.fire('Error', 'Failed to load user', 'error');
        this.saved.emit();
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    const payload = this.form.getRawValue();

    if (this.isEdit) {
      this.api.put(`users/${this.itemId}`, payload).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.status) {
            Swal.fire('Success', 'User updated successfully', 'success');
            this.saved.emit();
          }
        },
        error: (err) => {
          this.loading = false;
          Swal.fire('Error', err.error?.message || 'Failed to update user', 'error');
        }
      });
    } else {
      this.api.post('users', payload).subscribe({
        next: (res) => {
          this.loading = false;
          if (res.status) {
            Swal.fire('Success', 'User created successfully', 'success');
            this.saved.emit();
          }
        },
        error: (err) => {
          this.loading = false;
          Swal.fire('Error', err.error?.message || 'Failed to create user', 'error');
        }
      });
    }
  }
}
