"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerUser } from "@/lib/api";
import { registerSchema, type RegisterFormValues } from "@/lib/validation";

export function RegisterForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    try {
      const response = await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      login(response.token, { name: response.name, email: response.email });
      router.push("/");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Došlo je do greške pri registraciji.";
      setServerError(
        message.includes("vec postoji") || message.includes("već postoji")
          ? "Korisnik sa ovim email-om već postoji."
          : "Registracija nije uspjela. Provjerite podatke i pokušajte ponovo."
      );
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Registracija</CardTitle>
        <CardDescription>
          Kreirajte nalog da biste ostavljali recenzije i koristili dodatne
          funkcije.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="name">Ime i prezime</Label>
            <Input
              id="name"
              type="text"
              placeholder="Petar Petrović"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="petar@primer.com"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register("email")}
            />
            {errors.email ? (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Lozinka</Label>
            <Input
              id="password"
              type="password"
              placeholder="Najmanje 6 karaktera"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            {errors.password ? (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            ) : null}
          </div>

          {serverError ? (
            <p className="text-sm text-destructive">{serverError}</p>
          ) : null}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-800 text-white hover:bg-emerald-800/90"
          >
            {isSubmitting ? "Registrujem..." : "Registruj se"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Već imate nalog?{" "}
            <Link
              href="/login"
              className="font-medium text-emerald-800 underline-offset-4 hover:underline"
            >
              Prijavite se
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
