import { Suspense } from "react";
import Link from "next/link";
import { UserAuthForm } from "@/components/auth/user-auth-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Banyyan Wills
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Securely access your estate planning dashboard
          </p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <Suspense fallback={<div>Loading...</div>}>
            <UserAuthForm />
          </Suspense>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don&apos;t have an account? </span>
            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 hover:underline">
              Sign up
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600">
          <Link
            href="/"
            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
          >
            Back to homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
