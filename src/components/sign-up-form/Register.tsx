import React, { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Link } from "react-router-dom";
import {
  AuthContainer,
  AuthCard,
  Logo,
  Title,
  StyledForm,
  SwitchText,
  ErrorMessage,
} from "../auth/AuthStyles";
import logo from "../../assets/Lnombre.svg";

interface RegisterForm {
  nombres: string;
  apellidos: string;
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  nombres?: string;
  apellidos?: string;
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
}

const unknownError = "No fue posible completar el registro.";

const Register: React.FC = () => {
  const registerUser = useAuthStore((state) => state.register);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>({
    nombres: "",
    apellidos: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    setGeneralError(error);
  }, [error]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errors[e.target.name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
    if (generalError) setGeneralError(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!form.nombres) newErrors.nombres = "Los nombres son obligatorios.";
    if (!form.apellidos)
      newErrors.apellidos = "Los apellidos son obligatorios.";

    if (!form.email) newErrors.email = "El correo es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Correo inválido.";

    if (form.confirmEmail !== form.email)
      newErrors.confirmEmail = "Los correos no coinciden.";

    if (!form.password) newErrors.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6)
      newErrors.password = "Debe tener al menos 6 caracteres.";

    if (form.confirmPassword !== form.password)
      newErrors.confirmPassword = "Las contraseñas no coinciden.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setGeneralError(null);

    try {
      await registerUser({
        nombres: form.nombres,
        apellidos: form.apellidos,
        email: form.email,
        password: form.password,
      });
      navigate("/login", { replace: true });
    } catch (err) {
      if (err instanceof Error && err.message) {
        setGeneralError(err.message);
        return;
      }
      setGeneralError(unknownError);
    }
  };

  return (
    <AuthContainer>
      <AuthCard
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Logo src={logo} alt="Logo SIOMA" />
        <Title>Registro de Administrador</Title>
        <StyledForm onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={form.nombres}
            onChange={handleChange}
            className={errors.nombres ? "error" : ""}
          />
          {errors.nombres && <ErrorMessage>{errors.nombres}</ErrorMessage>}

          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={form.apellidos}
            onChange={handleChange}
            className={errors.apellidos ? "error" : ""}
          />
          {errors.apellidos && <ErrorMessage>{errors.apellidos}</ErrorMessage>}

          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

          <input
            type="email"
            name="confirmEmail"
            placeholder="Confirmar correo"
            value={form.confirmEmail}
            onChange={handleChange}
            className={errors.confirmEmail ? "error" : ""}
          />
          {errors.confirmEmail && (
            <ErrorMessage>{errors.confirmEmail}</ErrorMessage>
          )}

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "error" : ""}
          />
          {errors.confirmPassword && (
            <ErrorMessage>{errors.confirmPassword}</ErrorMessage>
          )}

          {generalError && <ErrorMessage>{generalError}</ErrorMessage>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </StyledForm>
        <SwitchText>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </SwitchText>
      </AuthCard>
    </AuthContainer>
  );
};

export default Register;
