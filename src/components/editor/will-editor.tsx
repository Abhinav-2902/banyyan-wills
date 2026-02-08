"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { willInputSchema, WillInputData } from "@/lib/validations/will";
import { saveWillAction, autoSaveWillAction } from "@/server/actions/will";
import { useAutoSave } from "@/hooks/use-auto-save";
import { PersonalDetailsStep } from "./steps/personal-details-step";
import { AssetsStep } from "./steps/assets-step";
import { BeneficiariesStep } from "./steps/beneficiaries-step";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

interface WillEditorProps {
  initialData: WillInputData;
  willId: string;
}

const STEPS = [
  { id: 0, name: "Personal Details", component: PersonalDetailsStep },
  { id: 1, name: "Assets", component: AssetsStep },
  { id: 2, name: "Beneficiaries", component: BeneficiariesStep },
];

/**
 * Main Will Editor orchestrator component
 * Manages multi-step form with auto-save functionality
 */
export function WillEditor({ initialData, willId }: WillEditorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Initialize form with zodResolver
  const form = useForm<WillInputData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(willInputSchema) as any,
    defaultValues: initialData,
    mode: "onChange",
  });

  // Watch all form data for auto-save
  const formData = form.watch();

  // Auto-save hook - uses autoSaveWillAction (no validation)
  const savingStatus = useAutoSave({
    data: formData,
    saveAction: async (data) => {
      const result = await autoSaveWillAction(data, willId);
      if (!result.success) {
        throw new Error(result.error || "Failed to save");
      }
    },
  });

  const CurrentStepComponent = STEPS[currentStep].component;

  const handleNext = async () => {
    // Validate current step fields before proceeding
    let fieldsToValidate: (keyof WillInputData)[] = [];

    if (currentStep === 0) {
      fieldsToValidate = ["fullName", "dob", "email", "phone", "residency"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["assets"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["beneficiaries"];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await form.trigger(fieldsToValidate as any);

    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    setSubmitMessage(null);
    
    try {
      const result = await saveWillAction(data, willId);
      if (result.success) {
        setSubmitMessage({ type: 'success', text: 'Will saved successfully!' });
        // Clear message after 5 seconds
        setTimeout(() => setSubmitMessage(null), 5000);
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to save will' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Top Bar: Progress Indicator + Auto-Save Status */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Will Editor</h1>
            
            {/* Auto-Save Status Badge */}
            <div className="flex items-center gap-2">
              {savingStatus === "saving" && (
                <div className="flex items-center gap-2 text-blue-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm font-medium">Saving...</span>
                </div>
              )}
              {savingStatus === "saved" && (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Saved</span>
                </div>
              )}
              {savingStatus === "error" && (
                <div className="flex items-center gap-2 text-red-600">
                  <span className="text-sm font-medium">Save failed</span>
                </div>
              )}
            </div>
          </div>

          {/* Step Progress Indicator */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      index < currentStep
                        ? "bg-gradient-to-br from-[#FF6B6B] to-[#FF8E8E] text-white"
                        : index === currentStep
                        ? "bg-[#FF6B6B] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`text-sm mt-2 ${
                      index === currentStep
                        ? "font-semibold text-[#FF6B6B]"
                        : "text-gray-600"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      index < currentStep ? "bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E]" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Area */}
        <FormProvider {...form}>
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <CurrentStepComponent />
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div className={`rounded-lg p-4 mb-6 ${
                submitMessage.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {submitMessage.type === 'success' ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-semibold">⚠️</span>
                  )}
                  <span className="font-medium">{submitMessage.text}</span>
                </div>
              </div>
            )}

            {/* Footer: Navigation Buttons */}
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 || isSubmitting}
              >
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext} disabled={isSubmitting}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Submit'
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
