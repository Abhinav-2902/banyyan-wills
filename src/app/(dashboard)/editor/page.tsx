import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { MultiStepWillForm } from "@/components/editor/multi-step-will-form";
import { prisma } from "@/lib/prisma";
import { CompleteWillFormData } from "@/lib/validations/will";

interface EditorPageProps {
  searchParams: {
    willId?: string;
  };
}

export default async function EditorPage({ searchParams }: EditorPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  let initialData: Partial<CompleteWillFormData> | undefined;
  let willId: string | undefined;

  // If editing an existing will, fetch the data
  if (searchParams.willId) {
    const will = await prisma.will.findUnique({
      where: {
        id: searchParams.willId,
        userId: session.user.id, // Ensure user owns this will
      },
    });

    // If will not found or user doesn't own it, redirect to dashboard
    if (!will) {
      redirect("/dashboard");
    }

    // Prevent editing finalized wills
    if (will.status === "PAID" || will.status === "COMPLETED") {
      redirect("/dashboard");
    }

    willId = will.id;

    // Parse the JSON data from the database
    if (will.data && typeof will.data === "object") {
      initialData = will.data as Partial<CompleteWillFormData>;
    }
  }

  return (
    <MultiStepWillForm initialData={initialData} willId={willId} />
  );
}
