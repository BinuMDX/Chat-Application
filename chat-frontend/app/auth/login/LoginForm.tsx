"use client";

import { api } from "@/lib/axios";
import { loginSchema, LoginSchema } from "@/lib/validators/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/button";
import { Card } from "@/components/card";
import { Input } from "@/components/input";
import { useAuthStore } from "@/features/auth/store";

interface LoginFormProps {
  standalone?: boolean;
}

export function LoginForm({ standalone = true }: LoginFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");

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
      setServerError(""); // Clear any previous errors
      const res = await api.post("/auth/login", values);
      setAuth(res.data.user, res.data.access_token, res.data.refresh_token);

      // Small delay to ensure Zustand persist completes
      await new Promise(resolve => setTimeout(resolve, 100));

      router.push("/chat");
    } catch (error) {
      console.error(error);
      // Extract the error message from the backend response
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Login failed. Please check your credentials.");
      }
    }
  };

  const formContent = (
    <>
      {standalone && <h1 className="text-xl font-semibold mb-4">Login</h1>}

      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input
            type="email"
            className=""
            placeholder="Email"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            className=""
            autoComplete="current-password"
            placeholder="Password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
          )}
        </div>
        <Button
          type="submit"
          variant="default"
          size="default"
          className="w-full"
        >
          Login
        </Button>
      </form>
    </>
  );

  if (standalone) {
    return <Card className="p-6 w-[380px]">{formContent}</Card>;
  }

  return formContent;
}
