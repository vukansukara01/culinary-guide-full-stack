import { RegisterForm } from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="surface-paper flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <RegisterForm />
      </div>
    </div>
  );
}
