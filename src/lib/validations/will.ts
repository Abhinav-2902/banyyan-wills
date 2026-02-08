import { z } from "zod";

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

// Input schema - what the form receives (dates as strings from HTML inputs)
export const willInputSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string()
    .refine((val) => val === "" || val.replace(/\D/g, '').length >= 10, {
      message: "Phone must have at least 10 digits"
    })
    .optional()
    .or(z.literal("")),
  residency: z.string().min(1, "Residency is required"),
  
  assets: z.array(
    z.object({
      type: z.enum(["REAL_ESTATE", "BANK_ACCOUNT", "STOCK", "VEHICLE", "OTHER"]),
      description: z.string().min(10, "Description must be at least 10 characters"),
      estimatedValue: z.number().positive("Value must be positive"),
    })
  ).default([]),

  beneficiaries: z.array(
    z.object({
      fullName: z.string().min(2, "Name is required"),
      relationship: z.string().min(1, "Relationship is required"),
      percentage: z.number().min(1).max(100),
    })
  ).default([]),
});

// Output schema - what gets validated and saved (dates as Date objects)
export const willSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  dob: z.coerce.date().max(eighteenYearsAgo, "You must be at least 18 years old"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  phone: z.string()
    .refine((val) => val === "" || val.replace(/\D/g, '').length >= 10, {
      message: "Phone must have at least 10 digits"
    })
    .optional()
    .or(z.literal("")),
  residency: z.string().min(1, "Residency is required"),
  
  assets: z.array(
    z.object({
      type: z.enum(["REAL_ESTATE", "BANK_ACCOUNT", "STOCK", "VEHICLE", "OTHER"]),
      description: z.string().min(10, "Description must be at least 10 characters"),
      estimatedValue: z.number().positive("Value must be positive"),
    })
  ).default([]),

  beneficiaries: z.array(
    z.object({
      fullName: z.string().min(2, "Name is required"),
      relationship: z.string().min(1, "Relationship is required"),
      percentage: z.number().min(1).max(100),
    })
  ).default([]),
}).refine((data) => {
  // Allow empty beneficiaries (user hasn't filled it out yet)
  if (data.beneficiaries.length === 0) return true;
  
  // If there are beneficiaries, total must equal 100%
  const total = data.beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
  return total === 100;
}, {
  message: "Total beneficiary allocation must equal exactly 100%",
  path: ["beneficiaries"],
});

export type WillFormData = z.infer<typeof willSchema>;
export type WillInputData = z.infer<typeof willInputSchema>;
