import { useForm } from "react-hook-form";
import { useSearchParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { API_RESET_PASSWORD } from "../../../services/servicesApi";

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await fetch(API_RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, NewPassword: data.password }),
      });

      const msg = await res.text();
      if (res.ok) {
        Swal.fire("Éxito", msg, "success").then(() => navigate("/"));
      } else {
        Swal.fire("Error", msg, "error");
      }
    } catch (err) {
      Swal.fire("Error", "No se pudo cambiar la contraseña", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold text-center mb-4">Restablecer contraseña</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
          <input
            type="password"
            {...register("password", { required: "Campo requerido" })}
            className="w-full px-4 py-2 mt-2 border rounded-md"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

          <label className="block text-sm font-medium text-gray-700 mt-4">Confirmar contraseña</label>
          <input
            type="password"
            {...register("confirmPassword", {
              required: "Confirmar contraseña es obligatorio",
              validate: value => value === watch("password") || "Las contraseñas no coinciden"
            })}
            className="w-full px-4 py-2 mt-2 border rounded-md"
          />
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}

          <button
            type="submit"
            className="w-full mt-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
