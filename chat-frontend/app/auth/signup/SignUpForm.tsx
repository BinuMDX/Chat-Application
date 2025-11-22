"use client";

import { api } from "@/lib/axios";
import { SignupSchema, signupSchema } from "@/lib/validators/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card } from "../../../components/card";
import { Input } from "../../../components/input";
import { Button } from "../../../components/button";
import { useSignup } from "@/features/auth/hooks";

interface SignUpFormProps {
  standalone?: boolean;
}

export function SignUpForm({ standalone = true }: SignUpFormProps) {
  const router = useRouter();

  const { signup, loading } = useSignup();

  const form = useForm<SignupSchema>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const { errors } = form.formState;

  const onSubmit = async (values: SignupSchema) => {
    try {
      await api.post("/auth/signup", values);
      router.push("/");
    }
    catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  const formContent = (
    <>
      {standalone && <h1 className="text-xl font-semibold mb-4">Sign Up</h1>}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Input placeholder="Username" {...form.register("username")} />
          {errors.username && (
            <p className="text-red-500 text-sm">{errors.username.message}</p>
          )}
        </div>

        <div>
          <Input placeholder="Email" {...form.register("email")} />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            {...form.register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            {...form.register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </>
  );

  if (standalone) {
    return <Card className="p-6 w-[380px]">{formContent}</Card>;
  }

  return formContent;
}
