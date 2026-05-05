import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export interface AuthUser {
  principal: string;
  isAuthenticated: boolean;
}

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && !!identity;
  const isLoading = loginStatus === "logging-in";

  const principal = identity?.getPrincipal().toString() ?? null;

  return {
    identity,
    principal,
    isAuthenticated,
    isLoading,
    loginStatus,
    login,
    logout: clear,
  };
}
