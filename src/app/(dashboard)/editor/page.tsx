import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { WillIntakeForm } from "@/components/forms/will-intake-form";
import { prisma } from "@/lib/prisma";
import { WillFormData } from "@/lib/validations/will";

interface EditorPageProps {
  searchParams: {
    willId?: string;
  };
}

export default async function EditorPage({ searchParams }: EditorPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  let initialData: WillFormData | undefined;
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
      const data = will.data as Record<string, unknown>;
      
      initialData = {
        fullName: (data.fullName as string) || "",
        dob: data.dob ? new Date(data.dob as string) : new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
        residency: (data.residency as string) || "",
        assets: (data.assets as WillFormData["assets"]) || [],
        beneficiaries: (data.beneficiaries as WillFormData["beneficiaries"]) || [],
      };
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF9F5] to-[#FFF5F0]">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {willId ? "Edit Your Will" : "Create Your Will"}
          </h1>
          <p className="text-gray-600 text-lg">
            {willId 
              ? "Update your estate planning details below" 
              : "Let's start planning for your future. Fill in the details below."}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <WillIntakeForm initialData={initialData} willId={willId} />
        </div>
      </div>
    </div>
  );
}
