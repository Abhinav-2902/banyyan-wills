"use client";

import { useFormContext } from "react-hook-form";
import { WillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Personal Details step component for the Will Editor
 * Uses form context from parent WillEditor component
 */
export function PersonalDetailsStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<WillFormData>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personal Details</h2>
        <p className="text-sm text-gray-600 mt-1">
          Please provide your basic information
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Legal Name *</Label>
          <Input
            id="fullName"
            {...register("fullName")}
            placeholder="Enter your full legal name"
            className={errors.fullName ? "border-red-500" : ""}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            type="date"
            {...register("dob")}
            className={errors.dob ? "border-red-500" : ""}
          />
          {errors.dob && (
            <p className="text-sm text-red-600">{errors.dob.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="your.email@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+1 (555) 123-4567"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Residency */}
        <div className="space-y-2">
          <Label htmlFor="residency">State/Country of Residency *</Label>
          <Input
            id="residency"
            {...register("residency")}
            placeholder="e.g., California, USA"
            className={errors.residency ? "border-red-500" : ""}
          />
          {errors.residency && (
            <p className="text-sm text-red-600">{errors.residency.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
