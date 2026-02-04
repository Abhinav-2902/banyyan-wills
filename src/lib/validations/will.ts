import { z } from "zod";

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

export const willSchema = z.object({
  fullName: z.string().min(2, "Full Name must be at least 2 characters"),
  dob: z.coerce.date().max(eighteenYearsAgo, "You must be at least 18 years old"),
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
  const total = data.beneficiaries.reduce((sum, b) => sum + b.percentage, 0);
  return total === 100;
}, {
  message: "Total beneficiary allocation must equal exactly 100%",
  path: ["beneficiaries"],
});

export type WillFormData = z.infer<typeof willSchema>;
