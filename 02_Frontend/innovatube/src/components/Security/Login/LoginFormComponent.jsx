import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import '../../../css/Login.css';

const LoginForm = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      {loading ? (
        <div className="custom-spinner" />
      ) : (
        <div className="w-full max-w-md px-8 py-6 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-4">            
            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-700" htmlFor="login">
                Usuario o Correo
              </label>
              <input
                type="text"
                name="login"
                placeholder="Ingresa tu usuario o correo"
                {...register('login', { required: true })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.login ? 'border-red-500' : ''
                }`}
              />
              {errors.login && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-semibold text-gray-700">Contraseña</label>
              <input
                type="password"
                name="accessPassword"
                placeholder="Ingresa tu contraseña"
                {...register('accessPassword', { required: true })}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  errors.accessPassword ? 'border-red-500' : ''
                }`}
              />
              {errors.accessPassword && (
                <p className="text-red-500 text-sm mt-1">Este campo es requerido.</p>
              )}
            </div>

            <div className="flex items-center justify-center mb-4">
              <button
                type="submit"
                className="w-full px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Iniciar Sesión
              </button>
            </div>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">¿No tienes una cuenta? </span>
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Registrate
              </Link>
            </div>

            <div className="flex mt-4 flex-col items-center justify-center text-sm text-gray-600 gap-2">
              <Link to="/forgot-password" className="hover:underline hover:text-blue-600">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
