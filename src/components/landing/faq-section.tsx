"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Is my will legally valid?",
      answer:
        "Yes! Our wills are designed to meet all legal requirements. However, we recommend having your will reviewed by a local attorney to ensure it complies with your specific state laws and unique circumstances.",
    },
    {
      question: "How long does it take to create a will?",
      answer:
        "Most people complete their will in 30-60 minutes. You can save your progress and return anytime, so there's no pressure to finish in one sitting.",
    },
    {
      question: "Can I update my will later?",
      answer:
        "Absolutely! Life changes, and your will should too. You can log in anytime to make updates. We recommend reviewing your will annually or after major life events.",
    },
    {
      question: "Is my information secure?",
      answer:
        "Security is our top priority. We use bank-level encryption to protect your data, and we never share your information with third parties. Your will is stored securely and only accessible by you.",
    },
    {
      question: "What happens after I create my will?",
      answer:
        "You'll receive a PDF of your will that you can download and print. We'll also provide instructions on how to properly sign and store your will to ensure it's legally enforceable.",
    },
    {
      question: "Do I need a lawyer?",
      answer:
        "For straightforward estates, our service provides everything you need. However, if you have complex assets, business interests, or unique family situations, we recommend consulting with an estate planning attorney.",
    },
  ]

  return (
    <section id="faq" className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about creating your will
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-gray-500 transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
