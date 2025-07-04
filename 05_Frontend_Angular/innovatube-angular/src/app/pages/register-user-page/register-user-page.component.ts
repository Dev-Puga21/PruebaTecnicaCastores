// src/app/pages/register-user-page/register-user-page.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { HttpClient } from '@angular/common/http';
import { RecaptchaModule } from 'ng-recaptcha';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-user-page',
  standalone: true,
  imports: [CommonModule, RecaptchaModule, ReactiveFormsModule],
  templateUrl: './register-user-page.component.html',
  styleUrls: ['./register-user-page.component.css']
})
export class RegisterUserPageComponent {
  registerForm: FormGroup;
  captchaToken: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Username: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      accessPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('accessPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { notMatching: true };
  }

  handleCaptcha(token: string | null) {
    this.captchaToken = token;
  }

  async onSubmit() {
    if (!this.captchaToken) {
      Swal.fire('Captcha requerido', 'Por favor verifica que no eres un robot.', 'warning');
      return;
    }

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const confirm = await Swal.fire({
      title: 'Confirmar Datos',
      text: '¿Estás seguro de que los datos ingresados son correctos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Cancelar',
    });

    if (confirm.isConfirmed) {
      const payload = {
        ...this.registerForm.value,
        recaptchaToken: this.captchaToken,
      };

      try {
        const response = await this.http.post(API_ENDPOINTS.REGISTER_USER, payload, {
          responseType: 'text' // por si el backend devuelve texto plano
        }).toPromise();

        Swal.fire('Éxito', 'Cuenta creada exitosamente', 'success').then(() => {
          this.registerForm.reset();
          this.captchaToken = null;
          this.router.navigate(['/']);
        });

      } catch (error: any) {
        const msg = error?.error || 'Error inesperado al registrar.';
        Swal.fire('Error', msg, 'error');
      }
    }
  }
}
