import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { API_ENDPOINTS } from '../../config/api-endpoints';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs'; // 👈 agregado

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {
  loginForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      login: ['', Validators.required],
      accessPassword: ['', Validators.required],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { login, accessPassword } = this.loginForm.value;

    try {
      const response: any = await firstValueFrom(
        this.http.post(API_ENDPOINTS.LOGIN, { login, accessPassword })
      );

      const token = response.token;
      this.authService.setUserData(token);
      this.router.navigate(['/home']);
    } catch (error: any) {
      console.error('Error en la solicitud:', error);

      if (error.status === 401) {
        const msg = error.error?.message || '';
        if (msg.includes('Inactivo')) {
          Swal.fire('Cuenta inactiva', 'Por favor, contacta al administrador.', 'warning');
        } else {
          Swal.fire('Error', 'Usuario o contraseña incorrectos.', 'error');
        }
      } else {
        Swal.fire('Error del servidor', 'Intenta nuevamente más tarde.', 'error');
      }
    } finally {
      this.loading = false;
    }
  }
}
