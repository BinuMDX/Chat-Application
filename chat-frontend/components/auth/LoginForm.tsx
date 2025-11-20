"use client";

import { api } from "@/lib/axios";
import { loginSchema, LoginSchema } from "@/lib/validators/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginSchema) => {
    try {
      await api.post("/auth/login", values);
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
          placeholder="Password"
          {...form.register("password")}
        />

        <Button type="submit" variant="default" size="default" className="w-full">
          Login
        </Button>
      </form>
    </Card>
  );
}
