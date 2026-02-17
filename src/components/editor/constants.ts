import { User, FileText, Users, Gavel, Eye, Heart, Home, Scale, ScrollText, Landmark, Activity, ClipboardList } from "lucide-react";

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: React.ElementType;
}

export const STEPS: Step[] = [
  { number: 1, title: "Personal Details", description: "Basic information", icon: User },
  { number: 2, title: "Will Details", description: "Declaration & signing", icon: FileText },
  { number: 3, title: "Will Executors", description: "Executor selection", icon: Users },
  { number: 4, title: "Dispute Resolver", description: "Conflict resolution", icon: Gavel },
  { number: 5, title: "Witness Details", description: "Witness information", icon: Eye },
  { number: 6, title: "Beneficiaries", description: "Who inherits", icon: Users },
  { number: 7, title: "Charity", description: "Charitable donations", icon: Heart },
  { number: 8, title: "Assets", description: "Property & belongings", icon: Home },
  { number: 9, title: "Residuary Clause", description: "Remaining estate", icon: Scale },
  { number: 10, title: "Special Wishes", description: "Funeral & other wishes", icon: ScrollText },
  { number: 11, title: "Loan Repayment", description: "Liabilities", icon: Landmark },
  { number: 12, title: "Organ Donation", description: "Donation preferences", icon: Activity },
  { number: 13, title: "Review", description: "Final review", icon: ClipboardList },
];
