import { RegisterForm } from '@/components/register-form'

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold">Create Test User</h1>
        <RegisterForm />
      </div>
    </div>
  )
}

