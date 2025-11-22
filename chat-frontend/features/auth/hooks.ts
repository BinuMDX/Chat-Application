import { SignupSchema } from "@/lib/validators/signupSchema";
import { useState } from "react";
import { signupUser } from "./api";

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