"use client";

import { api } from "@/lib/axios";
import { loginSchema, LoginSchema } from "@/lib/validators/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { useLogin } from "@/features/auth/hooks";
import { useAuthStore } from "@/store";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const setAuth = useAuthStore((s) => s.setAuth);

  const onSubmit = async (values: LoginSchema) => {
    try {
      const res = await api.post("/auth/login", values);
      setAuth(res.data.user, res.data.access_token, res.data.refresh_token);
      
      // Small delay to ensure Zustand persist completes
      await new Promise(resolve => setTimeout(resolve, 100));
      
      router.push("/chat");
    } catch (error) {
      console.error(error);
      alert("Invalid credentials");
    }
  };

  return (
    <Card className="p-6 w-[380px]">
      <h1 className="text-xl font-semibold mb-4">Login</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          type="email"
          className=""
          placeholder="Email"
          {...form.register("email")}
        />
        <Input
          type="password"
          className=""
          autoComplete="current-password"
          placeholder="Password"
          {...form.register("password")}
        />

        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full"
        >
          Login
        </Button>
      </form>
    </Card>
  );
}
