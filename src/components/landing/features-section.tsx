"use client"

import { Heart, FileText, Shield, Clock } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Heart,
      title: "Compassionate Guidance",
      description:
        "We understand this process can feel emotional. Our gentle approach helps you move forward with confidence.",
    },
    {
      icon: FileText,
      title: "Simple & Clear",
      description:
        "No legal jargon. We use plain language to help you understand every decision you make.",
    },
    {
      icon: Shield,
      title: "Legally Valid",
      description:
        "Your will is prepared to meet all legal requirements, giving you and your family peace of mind.",
    },
    {
      icon: Clock,
      title: "Save & Continue",
      description:
        "Take your time. Save your progress and return whenever you're ready to continue.",
    },
  ]

  return (
    <section className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            A Gentle, Guided Process
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;ve designed every step to be straightforward and supportive,
            so you can focus on what truly matters.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-rose-50/50 transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 mb-4">
                  <Icon className="h-6 w-6 text-[#FF6B6B]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
