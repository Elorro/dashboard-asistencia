import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  StateStorage,
} from "zustand/middleware";

import {
  loginRequest,
  registerRequest,
  fetchProfile,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
} from "../api/authService";

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  hydrateProfile: () => Promise<void>;
  clearError: () => void;
}

const memoryStorage: StateStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

const resolveStorage = (): StateStorage =>
  typeof window === "undefined" ? memoryStorage : window.localStorage;

const parseErrorMessage = (error: unknown): string => {
  const maybeAxiosMessage =
    typeof (error as { response?: { data?: { message?: unknown } } }).response
      ?.data?.message === "string"
      ? ((error as { response?: { data?: { message?: string } } }).response?.data
          ?.message as string)
      : null;

  if (maybeAxiosMessage) return maybeAxiosMessage;
  if (error instanceof Error && error.message) return error.message;
  return "No se pudo completar la acción de autenticación.";
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => {
      let lastError: string | null = null;

      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        isLoading: false,
        error: null,

        login: async (credentials) => {
          set({ isLoading: true, error: null });
          try {
            const response = await loginRequest(credentials);
            lastError = null;
            set({
              user: response.user,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken ?? null,
              isLoading: false,
            });
          } catch (error) {
            const message = parseErrorMessage(error);
            lastError = message;
            set({ isLoading: false, error: message });
            throw error;
          }
        },

        register: async (payload) => {
          set({ isLoading: true, error: null });
          try {
            await registerRequest(payload);
            lastError = null;
            set({ isLoading: false });
          } catch (error) {
            const message = parseErrorMessage(error);
            lastError = message;
            set({ isLoading: false, error: message });
            throw error;
          }
        },

        logout: () => {
          lastError = null;
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            error: null,
          });
        },

        hydrateProfile: async () => {
          const { accessToken, user } = get();
          if (!accessToken || user) return;

          set({ isLoading: true, error: null });
          try {
            const profile = await fetchProfile(accessToken);
            lastError = null;
            set({ user: profile, isLoading: false });
          } catch (error) {
            const message = parseErrorMessage(error);
            lastError = message;
            set({
              isLoading: false,
              user: null,
              accessToken: null,
              refreshToken: null,
              error: message,
            });
          }
        },

        clearError: () => {
          const { error } = get();
          if (error !== null || lastError !== null) {
            lastError = null;
            set({ error: null }, false, "auth/clearError");
          }
        },
      };
    },
    {
      name: "auth-storage",
      storage: createJSONStorage(resolveStorage),
      partialize: ({ user, accessToken, refreshToken }) => ({
        user,
        accessToken,
        refreshToken,
      }),
    }
  )
);
