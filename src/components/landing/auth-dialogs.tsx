"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserAuthForm } from "@/components/auth/user-auth-form"
import { RegisterForm } from "@/components/auth/register-form"

type AuthDialogType = "login" | "signup" | null

interface AuthDialogsProps {
  open: AuthDialogType
  onOpenChange: (open: AuthDialogType) => void
}

export function AuthDialogs({ open, onOpenChange }: AuthDialogsProps) {
  const handleClose = () => onOpenChange(null)
  
  const switchToSignup = () => onOpenChange("signup")
  const switchToLogin = () => onOpenChange("login")

  return (
    <>
      {/* Login Dialog */}
      <Dialog open={open === "login"} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Sign in to your account to continue
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <UserAuthForm onSuccess={handleClose} />
          </div>
          <div className="text-center text-sm text-gray-600 mt-4">
            Don&apos;t have an account?{" "}
            <button
              onClick={switchToSignup}
              className="font-medium text-[#FF6B6B] hover:text-[#FF5252] transition-colors"
            >
              Sign up
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog open={open === "signup"} onOpenChange={(isOpen) => !isOpen && handleClose()}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Create Account
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Get started with your will in minutes
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <RegisterForm 
              onSuccess={handleClose} 
              onSwitchToLogin={switchToLogin}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
