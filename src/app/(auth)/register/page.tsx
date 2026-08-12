import RegisterForm from '@/features/auth/components/register-form'

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-neutral-900">
            Create your Duora account
          </h1>
          <p className="mt-1.5 text-[14px] text-neutral-400">
            Start your journey together.
          </p>
        </div>

        <div className="rounded-[28px] border border-neutral-200/70 bg-white/80 p-8 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_16px_40px_-16px_rgba(0,0,0,0.08)] backdrop-blur-xl">
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}