import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email je obavezan.")
    .email("Unesite validan email."),
  password: z.string().min(1, "Lozinka je obavezna."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ime mora imati najmanje 2 karaktera."),
  email: z
    .string()
    .trim()
    .min(1, "Email je obavezan.")
    .email("Unesite validan email."),
  password: z
    .string()
    .min(6, "Lozinka mora imati najmanje 6 karaktera."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const reviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, "Ocjena mora biti između 1 i 5.")
    .max(5, "Ocjena mora biti između 1 i 5."),
  comment: z
    .string()
    .trim()
    .min(1, "Molimo unesite komentar.")
    .max(2000, "Komentar je predugačak."),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;
