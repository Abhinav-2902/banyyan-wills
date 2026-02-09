"use client"

import { useState } from "react"
import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { PricingSection } from "@/components/landing/pricing-section"
import { FAQSection } from "@/components/landing/faq-section"
import { Footer } from "@/components/landing/footer"
import { AuthDialogs } from "@/components/landing/auth-dialogs"

type AuthDialogType = "login" | "signup" | null

export default function Home() {
  const [authDialog, setAuthDialog] = useState<AuthDialogType>(null)

  return (
    <div className="min-h-screen bg-white">
      <Header 
        onLoginClick={() => setAuthDialog("login")}
        onSignUpClick={() => setAuthDialog("signup")}
      />
      <main>
        <HeroSection onGetStartedClick={() => setAuthDialog("signup")} />
        <FeaturesSection />
        <HowItWorks />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
      <AuthDialogs open={authDialog} onOpenChange={setAuthDialog} />
    </div>
  )
}
