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

export function SignUpForm(){
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

    return (
    <Card className="p-6 w-[380px]">
      <h1 className="text-xl font-semibold mb-4">Sign Up</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Username" {...form.register("username")} />
        <Input placeholder="Email" {...form.register("email")} />
        <Input
          type="password"
          placeholder="Password"
          {...form.register("password")}
        />
        <Input
          type="password"
          placeholder="Confirm Password"
          {...form.register("confirmPassword")}
        />

        <Button type="submit" className="w-full">
          Sign Up
        </Button>
      </form>
    </Card>
  );
}
