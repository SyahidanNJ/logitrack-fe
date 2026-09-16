import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LogitrackAuthService } from '../../../core/services/logitrack-auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  returnUrl: string = '/';
  isPasswordVisible = false;

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: LogitrackAuthService
  ) { 
    // Redirect if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboards']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      nik: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboards';
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.authService.login(this.f['nik'].value, this.f['password'].value).subscribe({
      next: (res) => {
        if (res.status) {
          this.router.navigate([this.returnUrl]);
        } else {
          Swal.fire('Error', res.message || 'Login failed', 'error');
        }
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Login failed', 'error');
      }
    });
  }
}
