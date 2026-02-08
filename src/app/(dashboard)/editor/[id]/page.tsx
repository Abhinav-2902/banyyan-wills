import { auth } from "@/auth";
import { findWillById } from "@/server/data/will";
import { WillEditor } from "@/components/editor/will-editor";
import { redirect } from "next/navigation";
import { WillInputData } from "@/lib/validations/will";

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


  // 5. Parse the Will data and ensure DOB is in string format
  // The data field is JSON, cast it to WillInputData
  // We don't validate here because we want to allow users to fill out empty/invalid forms
  const willData = will.data as WillInputData;
  
  // Convert DOB to string format if it's a Date object (for HTML date input)
  if (willData.dob && typeof willData.dob !== 'string') {
    const date = new Date(willData.dob);
    willData.dob = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  }

  // 6. Render the WillEditor client component
  return <WillEditor initialData={willData} willId={will.id} />;
}
