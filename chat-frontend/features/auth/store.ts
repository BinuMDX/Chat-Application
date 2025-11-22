import { updateAxiosToken } from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  email: string;
  username: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      hasHydrated: false,

      setAuth: (user, accessToken, refreshToken) =>{
        updateAxiosToken
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        })},

      clearAuth: () =>{
        updateAxiosToken(null);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        })},

      updateTokens: (accessToken, refreshToken) =>{
        updateAxiosToken(accessToken);
        set({
          accessToken,
          refreshToken,
        })},
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => 
        (state) => {
          state!.hasHydrated = true;
        },
    }
  )
);

// // Set hasHydrated immediately for fresh sessions (when there's nothing to rehydrate)
// if (typeof window !== "undefined") {
//   // Small delay to allow persist middleware to initialize
//   setTimeout(() => {
//     if (!useAuthStore.getState().hasHydrated) {
//       useAuthStore.setState({ hasHydrated: true });
//     }
//   }, 0);
// }

if (typeof window !== "undefined") {
  useAuthStore.persist.rehydrate();
}
