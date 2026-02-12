import { auth } from "@/auth";
import { findWillById } from "@/server/data/will";
import { MultiStepWillForm } from "@/components/editor/multi-step-will-form";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CompleteWillFormData } from "@/lib/validations/will";
import { DownloadPDFButton } from "@/components/editor/download-pdf-button";

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
    // Render completed will view
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            Will Completed!
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
            Your Last Will & Testament has been successfully generated and completed. You can download the PDF below.
          </p>
          
          <div className="flex justify-center gap-4">
            <DownloadPDFButton willId={will.id} />
             <Link href="/dashboard" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
              Back to Dashboard
            </Link>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500">
            <p>Note: Completed wills cannot be edited correctly. If you need to make changes, please create a new will.</p>
          </div>
        </div>
      </div>
    );
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
