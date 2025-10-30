import React, { useState } from "react";
import type { ChangeEvent } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
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

const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      login(email, password);
    }
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
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className={errors.email ? "error" : ""}
          />
          {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className={errors.password ? "error" : ""}
          />
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}

          <button type="submit">Entrar</button>
        </StyledForm>
        <SwitchText>
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </SwitchText>
      </AuthCard>
    </AuthContainer>
  );
};

export default Login;
