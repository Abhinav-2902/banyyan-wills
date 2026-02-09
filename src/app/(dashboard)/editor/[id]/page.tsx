import { auth } from "@/auth";
import { findWillById } from "@/server/data/will";
import { MultiStepWillForm } from "@/components/editor/multi-step-will-form";
import { redirect } from "next/navigation";
import { CompleteWillFormData } from "@/lib/validations/will";

interface EditorPageProps {
  params: Promise<{
    id: string;
  }>;
}

/**
 * Will Editor Page - Server Component
 * Fetches the Will data and renders the WillEditor client component
 */
export default async function EditorPage({ params }: EditorPageProps) {
  // Await params to get the ID
  const { id } = await params;

  // 1. Authentication check
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  // 2. Fetch the Will by ID
  const will = await findWillById(id, session.user.id);

  // 3. Authorization check - ensure user owns this Will
  if (!will) {
    redirect("/dashboard");
  }

  // 4. Check if Will is editable (not PAID or COMPLETED)
  if (will.status === "PAID" || will.status === "COMPLETED") {
    // Redirect to a read-only view or dashboard
    redirect("/dashboard");
  }


  // 5. Parse the Will data
  // The data field is JSON, cast it to CompleteWillFormData
  // We don't validate here because we want to allow users to fill out empty/invalid forms
  const willData = will.data as Partial<CompleteWillFormData>;

  // 6. Render the MultiStepWillForm client component
  return <MultiStepWillForm initialData={willData} willId={will.id} />;
}
