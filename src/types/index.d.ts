export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type UserRole = "USER" | "LAWYER" | "ADMIN";

export type WillStatus = "DRAFT" | "PAID" | "COMPLETED";

export type AccessPermission = "VIEW" | "COMMENT" | "EDIT";

export type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export interface WillDashboardDTO {
  id: string;
  status: 'DRAFT' | 'PAID' | 'COMPLETED'; // Match your Prisma Enum
  lastEdited: Date;
  title: string; // Extracted from the JSON blob
  progress: number; // A calculated percentage (0-100)
}
