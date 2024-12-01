import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="mb-6 text-center text-3xl font-bold">Login to Moontech</h1>
        <LoginForm />
      </div>
    </div>
  )
}

