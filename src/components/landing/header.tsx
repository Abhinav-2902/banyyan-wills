"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  onLoginClick: () => void
  onSignUpClick: () => void
}

export function Header({ onLoginClick, onSignUpClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-900">
            Banyyan Legacies
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="#testimonials"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Testimonials
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="#faq"
            className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            FAQ
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            onClick={onLoginClick}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
          >
            Log In
          </Button>
          <Button 
            onClick={onSignUpClick}
            className="bg-[#FF6B6B] hover:bg-[#FF5252] text-white transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  )
}
