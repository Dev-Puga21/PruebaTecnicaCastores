import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

const API_FORGOT_PASSWORD = 'https://innovatube20250629202212.azurewebsites.net/api/forgot-password';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  form: FormGroup;
  sent = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    try {
      const response = await this.http.post(API_FORGOT_PASSWORD, { Email: this.form.value.email }, { responseType: 'text' }).toPromise();

      this.sent = true;
      Swal.fire('Éxito', response || 'Correo enviado correctamente', 'success');
    } catch (error: any) {
      const msg = error?.error || 'No se pudo enviar la solicitud';
      Swal.fire('Error', msg, 'error');
    }
  }
}
