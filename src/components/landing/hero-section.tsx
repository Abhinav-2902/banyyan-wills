"use client"

import Link from "next/link"
import { Shield, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProcessCard } from "./process-card"

interface HeroSectionProps {
  onGetStartedClick: () => void
}

export function HeroSection({ onGetStartedClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-rose-50/30 py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                Plan for Tomorrow,{" "}
                <span className="text-[#FF6B6B]">With Peace Today</span>
              </h1>
              <p className="text-lg leading-8 text-gray-600 max-w-xl">
                Creating a will doesn&apos;t have to feel overwhelming. We&apos;ll guide you
                through each step with care, helping you protect what matters most.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={onGetStartedClick}
                className="w-full sm:w-auto bg-[#FF6B6B] hover:bg-[#FF5252] text-white px-8 py-6 text-base font-semibold"
              >
                Get Started →
              </Button>
              <Link href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-base font-semibold"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                  <Shield className="h-4 w-4 text-[#FF6B6B]" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Legally Sound
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-100">
                  <Lock className="h-4 w-4 text-[#FF6B6B]" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  Secure & Private
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Process Card */}
          <div className="flex justify-center lg:justify-end">
            <ProcessCard />
          </div>
        </div>
      </div>
    </section>
  )
}
