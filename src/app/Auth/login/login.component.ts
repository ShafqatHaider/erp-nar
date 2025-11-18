import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Core/Services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
private route = inject(ActivatedRoute);
constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastr:ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

ngOnInit(): void {
     if (this.authService.isAuthenticated()) {
      this.router.navigate(['/main/dashboard']);
    }
}

   onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: () => {
          // Get return url from route parameters or default to dashboard
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
          this.toastr.success("You are loggin Successfully")
          this.router.navigateByUrl(returnUrl);

        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login failed';
          this.toastr.error(error.error?.message);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}