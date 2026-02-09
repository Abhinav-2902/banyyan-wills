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
  // 6. Render the MultiStepWillForm client component
  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-serif">
          Last Will & Testament
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Complete the sections below to draft your legally valid will.
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <MultiStepWillForm initialData={willData} willId={will.id} />
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Your progress is saved securely. You can return to complete this later.</p>
      </div>
    </div>
  );
}
