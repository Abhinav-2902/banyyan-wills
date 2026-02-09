"use client"

import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Mother of Two",
      content:
        "I'd been putting off creating a will for years. Banyyan made it so easy and stress-free. I finished in less than an hour!",
      rating: 5,
    },
    {
      name: "James Chen",
      role: "Small Business Owner",
      content:
        "The guidance was clear and compassionate. I felt supported through every decision, and now I have peace of mind.",
      rating: 5,
    },
    {
      name: "Maria Rodriguez",
      role: "Retiree",
      content:
        "As someone who's not tech-savvy, I was worried this would be complicated. But the process was incredibly simple and intuitive.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20 sm:py-32 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See what our customers have to say about their experience
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col p-8 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-[#FF6B6B] text-[#FF6B6B]"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-700 mb-6 flex-grow italic">
                &quot;{testimonial.content}&quot;
              </p>

              {/* Author */}
              <div className="border-t border-gray-100 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
