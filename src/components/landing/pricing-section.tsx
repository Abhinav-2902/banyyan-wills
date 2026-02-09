"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PricingSection() {
  const plans = [
    {
      name: "Basic Will",
      price: "₹999",
      description: "Perfect for individuals with straightforward estates",
      features: [
        "Legally valid will",
        "Asset distribution",
        "Beneficiary designation",
        "Digital download",
        "Email support",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Complete Estate Plan",
      price: "₹2,499",
      description: "Comprehensive planning for families and complex estates",
      features: [
        "Everything in Basic",
        "Guardian designation",
        "Trust creation",
        "Healthcare directives",
        "Power of attorney",
        "Priority support",
        "Annual updates",
      ],
      cta: "Most Popular",
      highlighted: true,
    },
  ]

  return (
    <section id="pricing" className="py-20 sm:py-32 bg-gradient-to-b from-white to-rose-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            One-time payment. No hidden fees. Update anytime.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`flex flex-col p-8 rounded-lg border-2 ${
                plan.highlighted
                  ? "border-[#FF6B6B] shadow-lg scale-105"
                  : "border-gray-200 shadow-sm"
              } bg-white`}
            >
              {plan.highlighted && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-[#FF6B6B] rounded-full">
                    RECOMMENDED
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-gray-600 mb-6">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">
                  {plan.price}
                </span>
                <span className="text-gray-600 ml-2">one-time</span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check className="h-5 w-5 text-teal-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className="w-full">
                <Button
                  className={`w-full py-6 text-base font-semibold ${
                    plan.highlighted
                      ? "bg-[#FF6B6B] hover:bg-[#FF5252] text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
