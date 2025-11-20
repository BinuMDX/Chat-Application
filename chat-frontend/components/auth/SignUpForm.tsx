import { api } from "@/lib/axios";
import { SignupSchema, signupSchema } from "@/lib/validators/signupSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function SignUpForm(){
    const router = useRouter();

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
      <h1 className="text-xl font-semibold mb-4">Register</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Username" {...form.register("username")} />
        <Input placeholder="Email" {...form.register("email")} />
        <Input
          type="password"
          placeholder="Password"
          {...form.register("password")}
        />
        <Input
          type="confirmPassword"
          placeholder="Confirm Password"
          {...form.register("password")}
        />

        <Button type="submit" className="w-full">
          Register
        </Button>
      </form>
    </Card>
  );
}