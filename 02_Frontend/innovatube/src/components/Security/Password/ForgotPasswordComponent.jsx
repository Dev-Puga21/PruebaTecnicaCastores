import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import { API_FORGOT_PASSWORD } from "../../../services/servicesApi";

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = async (data) => {
    try {
      const res = await fetch(API_FORGOT_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: data.email }),
      });

      const msg = await res.text();
      if (res.ok) {
        setSent(true);
        Swal.fire("Éxito", msg, "success");
      } else {
        Swal.fire("Error", msg, "error");
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo enviar la solicitud", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">¿Olvidaste tu contraseña?</h2>
        {sent ? (
          <p className="text-green-600 text-center">
            Revisa tu correo para restablecer la contraseña.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              {...register("email", {
                required: "El correo es obligatorio",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Correo inválido"
                }
              })}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}

            <button
              type="submit"
              className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enviar enlace
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
