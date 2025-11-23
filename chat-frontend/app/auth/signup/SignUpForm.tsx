"use client";

import { api } from "@/lib/axios";
import { SignupSchema, signupSchema } from "@/lib/validators/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "../../../components/card";
import { Input } from "../../../components/input";
import { Button } from "../../../components/button";
import axios from "axios";

interface SignUpFormProps {
  standalone?: boolean;
}

export function SignUpForm({ standalone = true }: SignUpFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Prevent double submission
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      setServerError(""); // Clear any previous errors

      // Exclude confirmPassword from the request (backend doesn't expect it)
      const { confirmPassword, ...signupData } = values;
      await api.post("/auth/signup", signupData);

      // Show success message
      setSuccessMessage("Account created successfully! Redirecting to login...");

      // Wait a bit to show the message, then redirect
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    }
    catch (error) {
      console.error(error);
      // Extract the error message from the backend response
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formContent = (
    <>
      {standalone && <h1 className="text-xl font-semibold mb-4">Sign Up</h1>}

      {serverError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {serverError}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

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

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Signing up..." : "Sign Up"}
        </Button>
      </form>
    </>
  );

  if (standalone) {
    return <Card className="p-6 w-[380px]">{formContent}</Card>;
  }

  return formContent;
}
