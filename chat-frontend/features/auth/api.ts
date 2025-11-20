import api from "@/lib/axios";
import { LoginSchema } from "@/lib/validators/loginSchema";
import { SignupSchema } from "@/lib/validators/signupSchema";

export async function loginUser(data: LoginSchema) {
  const res = await api.post("/auth/login", data);
  return res.data;
}

export async function signupUser(data: SignupSchema) {
  const res = await api.post("/auth/signup", data);
  return res.data;
}
