import { API_REGISTER_USER } from '../../../services/servicesApi';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';
import { useState } from 'react';

const RegisterUserComponent = () => {
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();
  const password = watch('accessPassword');

  const resetFields = () => {
    reset({
      FirstName: '',
      LastName: '',
      Username: '',
      Email: '',
      accessPassword: '',
      confirmPassword: ''
    });
    setCaptchaToken(null);
  };

  const onSubmit = async (data) => {
    if (!captchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Captcha requerido',
        text: 'Por favor verifica que no eres un robot.',
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: 'Confirmar Datos',
      text: '¿Estás seguro de que los datos ingresados son correctos?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Cancelar'
    });

    if (confirmResult.isConfirmed) {
      try {
        const payload = { ...data, recaptchaToken: captchaToken };

        const response = await fetch(API_REGISTER_USER, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Cuenta creada exitosamente'
          }).then(() => {
            resetFields();
            navigate("/");
          });
        } else {
          const msg = await response.text();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: msg || 'Error inesperado al registrar.',
          });
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo registrar.',
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl px-8 py-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">Registrate</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Nombre</label>
              <input type="text" {...register('FirstName', { required: true })} className={`w-full px-4 py-2 mt-1 border rounded-md ${errors.FirstName ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.FirstName && <p className="text-red-500 text-sm">Este campo es requerido.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Apellido</label>
              <input type="text" {...register('LastName', { required: true })} className={`w-full px-4 py-2 mt-1 border rounded-md ${errors.LastName ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.LastName && <p className="text-red-500 text-sm">Este campo es requerido.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Usuario</label>
              <input type="text" {...register('Username', { required: true })} className={`w-full px-4 py-2 mt-1 border rounded-md ${errors.Username ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.Username && <p className="text-red-500 text-sm">Este campo es requerido.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Correo</label>
              <input type="email" {...register('Email', { required: true, pattern: /^\S+@\S+$/i })} className={`w-full px-4 py-2 mt-1 border rounded-md ${errors.Email ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.Email && <p className="text-red-500 text-sm">Correo inválido.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Contraseña</label>
              <input type="password" {...register('accessPassword', { required: true })} className={`w-full px-4 py-2 mt-1 border rounded-md ${errors.accessPassword ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.accessPassword && <p className="text-red-500 text-sm">Este campo es requerido.</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Confirmar Contraseña</label>
              <input type="password" {...register('confirmPassword', { required: true, validate: value => value === password || 'Las contraseñas no coinciden' })} className={`w-full px-4 py-2 mt-1 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <ReCAPTCHA
              sitekey="6LdJXnErAAAAACqnix3q-wwL4Qs2KYGDaPMblypm"
              onChange={(token) => setCaptchaToken(token)}
            />
          </div>

          <button type="submit" className="w-full mt-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Registrar
          </button>

          <div className="text-center mt-4">
            <span className="text-sm text-gray-600">¿Ya tienes una cuenta? </span>
            <Link to="/" className="text-blue-600 hover:underline font-medium">
              Inicia sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterUserComponent;
