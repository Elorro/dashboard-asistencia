import api from "./api";

export interface AuthUser {
  id: string;
  nombres?: string;
  apellidos?: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken?: string | null;
}

const MOCK_FLAG =
  (import.meta.env.VITE_USE_MOCK_AUTH ?? "").toString().toLowerCase() === "true";
const MOCK_USERS_KEY = "sioma_mock_auth_users";
const MOCK_TOKEN_PREFIX = "mock-token-";

type MockUserRecord = AuthUser & { password: string };

let memoryMockUsers: MockUserRecord[] = [];

const withAuthHeader = (token: string) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const hasWindow = (): boolean => typeof window !== "undefined";

const readMockUsers = (): MockUserRecord[] => {
  if (hasWindow()) {
    const raw = window.localStorage.getItem(MOCK_USERS_KEY);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as MockUserRecord[];
      return [];
    } catch {
      return [];
    }
  }
  return memoryMockUsers;
};

const writeMockUsers = (users: MockUserRecord[]) => {
  if (hasWindow()) {
    window.localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
  }
  memoryMockUsers = users;
};

const stripPassword = (record: MockUserRecord): AuthUser => {
  const { password: _password, ...user } = record;
  return user;
};

const generateMockToken = (userId: string) => `${MOCK_TOKEN_PREFIX}${userId}`;

const parseTokenToUser = (token: string): MockUserRecord | null => {
  const users = readMockUsers();
  return (
    users.find((user) => generateMockToken(user.id) === token) ?? null
  );
};

const loginMock = async (
  credentials: LoginPayload
): Promise<AuthResponse> => {
  const users = readMockUsers();
  const user = users.find((u) => u.email === credentials.email);

  if (!user || user.password !== credentials.password) {
    throw new Error("Correo o contraseña incorrectos.");
  }

  const accessToken = generateMockToken(user.id);
  return {
    user: stripPassword(user),
    accessToken,
    refreshToken: null,
  };
};

const generateMockUserId = (): string => {
  const cryptoObj = globalThis.crypto as Crypto | undefined;
  if (cryptoObj?.randomUUID) {
    return `mock-user-${cryptoObj.randomUUID()}`;
  }
  return `mock-user-${Math.random().toString(36).slice(2, 11)}`;
};

const registerMock = async (payload: RegisterPayload): Promise<void> => {
  const users = readMockUsers();
  if (users.some((user) => user.email === payload.email)) {
    throw new Error("Ya existe un administrador con este correo.");
  }

  const newUser: MockUserRecord = {
    id: generateMockUserId(),
    nombres: payload.nombres,
    apellidos: payload.apellidos,
    email: payload.email,
    password: payload.password,
  };

  writeMockUsers([...users, newUser]);
};

const fetchProfileMock = async (token: string): Promise<AuthUser> => {
  const user = parseTokenToUser(token);
  if (!user) {
    throw new Error("Sesión inválida o expirada.");
  }
  return stripPassword(user);
};

export const isMockAuthEnabled = MOCK_FLAG;

export async function loginRequest(
  credentials: LoginPayload
): Promise<AuthResponse> {
  if (MOCK_FLAG) {
    return loginMock(credentials);
  }

  // API requires application/x-www-form-urlencoded format with username field
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  const { data } = await api.post<{ access_token: string; token_type: string }>(
    "/admin/login",
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  // Transform API response to match AuthResponse interface
  return {
    user: {
      id: credentials.email,
      email: credentials.email,
    },
    accessToken: data.access_token,
    refreshToken: null,
  };
}

export async function registerRequest(
  payload: RegisterPayload
): Promise<void> {
  if (MOCK_FLAG) {
    await registerMock(payload);
    return;
  }
  await api.post("/auth/register", payload);
}

export async function fetchProfile(token: string): Promise<AuthUser> {
  if (MOCK_FLAG) {
    return fetchProfileMock(token);
  }
  const { data } = await api.get<AuthUser>("/auth/me", withAuthHeader(token));
  return data;
}
