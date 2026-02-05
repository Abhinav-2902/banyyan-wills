import { findWillsByUser } from "@/server/data/will";
import { WillDashboardDTO } from "@/types";

export async function getUserDashboard(userId: string): Promise<WillDashboardDTO[]> {
  try {
    const wills = await findWillsByUser(userId);
    // Future business logic (e.g., filtering archived wills) goes here.
    return wills;
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    throw new Error("Failed to load dashboard data");
  }
}
