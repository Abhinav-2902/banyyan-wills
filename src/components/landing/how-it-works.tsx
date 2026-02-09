"use client"

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Answer Simple Questions",
      description:
        "We'll ask you about your assets, beneficiaries, and wishes. Take your time—you can save and return anytime.",
    },
    {
      number: "2",
      title: "Review Your Will",
      description:
        "See your complete will in plain language. Make changes until everything feels right.",
    },
    {
      number: "3",
      title: "Finalize & Download",
      description:
        "Get your legally valid will as a PDF. We'll also provide instructions for signing and storing it safely.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-gradient-to-b from-white to-rose-50/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create your will in three simple steps
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-3 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {/* Step Number */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF6B6B] text-white text-2xl font-bold mb-6">
                {step.number}
              </div>

              {/* Connector Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-rose-200" />
              )}

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
