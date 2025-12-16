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

interface Errors {
  email?: string;
  password?: string;
}

const unknownError = "No se pudo iniciar sesión. Intenta nuevamente.";

const Login: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    if (!email) newErrors.email = "El correo es obligatorio.";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Ingrese un correo válido.";

    if (!password) newErrors.password = "La contraseña es obligatoria.";
    else if (password.length < 6)
      newErrors.password = "Debe tener al menos 6 caracteres.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setGeneralError(null);

    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      if (err instanceof Error && err.message) {
        setGeneralError(err.message);
        return;
      }
      setGeneralError(unknownError);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
    if (generalError) setGeneralError(null);
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
    if (generalError) setGeneralError(null);
    setPassword(e.target.value);
  };

  return (
    <AuthContainer>
      <AuthCard
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Logo src={logo} alt="Logo SIOMA" />
        <Title>Iniciar Sesión</Title>
        <StyledForm onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={handleEmailChange}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={handlePasswordChange}
            className={errors.password ? "error" : ""}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

          {generalError && <ErrorMessage>{generalError}</ErrorMessage>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Ingresando..." : "Entrar"}
          </button>
        </StyledForm>
        <SwitchText>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </SwitchText>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;
