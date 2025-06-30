import { AuthContext } from '../../../context/AuthContext';
import { API_LOGIN } from '../../../services/servicesApi';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import LoginForm from './LoginFormComponent';
import Swal from 'sweetalert2';
import axios from 'axios';

const LoginLogic = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(API_LOGIN, {
        login: data.login,
        accessPassword: data.accessPassword,
      });

      const token = response.data.token;
      setUserData(token);
      localStorage.setItem("tokenData", token);
      navigate('/home');

    } catch (error) {
      console.error('Error en la solicitud:', error);
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.message;
        if (errorMessage?.includes("Inactivo")) {
          Swal.fire({
            icon: 'warning',
            title: 'Cuenta inactiva',
            text: 'Por favor, contacta al administrador.',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario o contraseña incorrectos.',
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error del servidor',
          text: 'Ocurrió un error durante el inicio de sesión. Intenta nuevamente más tarde.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return <LoginForm onSubmit={onSubmit} loading={loading} />;
};

export default LoginLogic;
