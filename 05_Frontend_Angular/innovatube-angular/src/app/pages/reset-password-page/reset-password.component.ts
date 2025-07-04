// src/app/pages/reset-password/reset-password.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { API_ENDPOINTS } from '../../config/api-endpoints';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent {
  form: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.token = this.route.snapshot.queryParamMap.get('token');

    this.form = this.fb.group({
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordMismatch: true };
  }

  async onSubmit(): Promise<void> {
    if (!this.token || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = {
      token: this.token,
      NewPassword: this.form.get('password')?.value
    };

    try {
      const response = await this.http.post(API_ENDPOINTS.RESET_PASSWORD, payload, { responseType: 'text' }).toPromise();

      Swal.fire('Éxito', response || 'Contraseña cambiada correctamente', 'success')
        .then(() => this.router.navigate(['/']));
    } catch (error: any) {
      const msg = error?.error || 'No se pudo cambiar la contraseña';
      Swal.fire('Error', msg, 'error');
    }
  }
}
