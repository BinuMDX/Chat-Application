import { useState } from "react";
import { loginUser, signupUser } from "./api";
import { LoginSchema } from "@/lib/validators/loginSchema";
import { SignupSchema } from "@/lib/validators/signupSchema";

export function useLogin() {
  const [loading, setLoading] = useState(false);

  const login = async (payload: LoginSchema) => {
    setLoading(true);
    try {
      const data = await loginUser(payload);

      // Save token
      localStorage.setItem("accessToken", data.accessToken);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
}

export function useSignup() {
  const [loading, setLoading] = useState(false);

  const signup = async (payload: SignupSchema) => {
    setLoading(true);
    try {
      await signupUser(payload);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  return { signup, loading };
}
