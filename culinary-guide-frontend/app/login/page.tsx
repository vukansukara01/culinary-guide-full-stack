import { Suspense } from "react";

import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-10 sm:px-6">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Učitavanje...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
