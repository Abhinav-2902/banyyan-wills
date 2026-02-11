"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { StepProgress } from "./step-progress";
import { SaveButton } from "./save-button";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { completeWillSchema, type CompleteWillFormData } from "@/lib/validations/will";
import { saveWillAction } from "@/server/actions/will";
import { Step2FamilyDetails } from "./steps/step2-family-details";
import { Step1TestatorDetails } from "./steps/step1-testator-details";
import { Step3AssetDetails } from "./steps/step3-asset-details";
import { Step4Beneficiaries } from "./steps/step4-beneficiaries";
import { Step5Guardianship } from "./steps/step5-guardianship";

interface MultiStepWillFormProps {
  initialData?: Partial<CompleteWillFormData>;
  willId?: string;
}

export function MultiStepWillForm({ initialData, willId }: MultiStepWillFormProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Define explicit default values to ensure nested objects are initialized
  const defaultFormValues: Partial<CompleteWillFormData> = {
    step1: {
      fullName: "",
      fatherMotherName: "",
      age: 0,
      dateOfBirth: "",
      gender: "Male",
      maritalStatus: "Single",
      panNumber: "",
      aadhaarNumber: "",
      residentialAddress: {
        addressLine1: "",
        city: "",
        state: "",
        pinCode: "",
        country: "India",
      },
      contactInfo: {
        mobileNumber: "",
        emailAddress: "",
      },
    },
    step2: {
      isMarried: false,
      hasChildren: false,
      children: [],
      hasSiblings: false,
      siblings: [],
      father: { name: "", status: "Alive" },
      mother: { name: "", status: "Alive" },
    },
    step3: {
      hasImmovableProperty: false,
      immovableProperties: [],
      hasBankAccounts: false,
      bankAccounts: [],
      hasInvestments: false,
      investments: [],
      hasVehicles: false,
      vehicles: [],
      hasJewelryValuables: false,
      jewelryValuables: undefined,
      hasBusinessInterests: false,
      businessInterests: [],
      hasDigitalAssets: false,
      digitalAssets: undefined,
      hasDebts: false,
      debts: [],
    },
    step4: {
      beneficiaries: [],
      distributionType: "Equal distribution",
      totalPercentage: 0,
    },
  };

  const methods = useForm<CompleteWillFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(completeWillSchema) as any,
    mode: "onChange",
    defaultValues: {
      ...defaultFormValues,
      ...(initialData || {}),
    },
  });

  const { handleSubmit, trigger, formState } = methods;

  const handleSaveDraft = useCallback(async () => {
    setIsSaving(true);
    try {
      const formData = methods.getValues();
      const result = await saveWillAction(formData, willId);
      
      if (result.success) {
        console.log("Draft saved successfully");
        // Don't reset the form - it causes re-renders and loses focus
      } else {
        console.error("Failed to save draft:", result.error);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
    } finally {
      setIsSaving(false);
    }
  }, [methods, willId]);

  // Auto-save on form change (debounced)
  useEffect(() => {
    if (!formState.isDirty) return;

    const timer = setTimeout(() => {
      handleSaveDraft();
    }, 5000); // Auto-save after 5 seconds of inactivity (increased to reduce interruptions)

    return () => clearTimeout(timer);
  }, [formState.isDirty, handleSaveDraft]);

  const validateCurrentStep = async (): Promise<boolean> => {
    const stepKey = `step${currentStep}` as keyof CompleteWillFormData;
    const isValid = await trigger(stepKey);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    console.log(`Step ${currentStep} validation result:`, isValid);
    
    if (!isValid) {
      console.error("Validation errors for current step:", methods.formState.errors);
      // Ensure specific step errors are logged if possible
      const stepKey = `step${currentStep}` as keyof CompleteWillFormData;
      console.error(`Specific errors for ${stepKey}:`, methods.formState.errors[stepKey]);
      
      // For step 3, log detailed array errors
      if (currentStep === 3 && methods.formState.errors.step3) {
        console.error("Step 3 detailed errors:", JSON.stringify(methods.formState.errors.step3, null, 2));
      }
    }
    
    if (isValid) {
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      
      // Save draft before moving to next step
      await handleSaveDraft();
      
      // Move to next step
      if (currentStep < 7) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: CompleteWillFormData) => {
    setIsSaving(true);
    try {
      const result = await saveWillAction(data, willId);
      
      if (result.success) {
        // Redirect to dashboard or success page
        router.push("/dashboard/wills");
      } else {
        console.error("Failed to submit will:", result.error);
        alert(result.error || "Failed to submit will");
      }
    } catch (error) {
      console.error("Error submitting will:", error);
      alert("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1TestatorDetails />;
      case 2:
        return <Step2FamilyDetails />;
      case 3:
        return <Step3AssetDetails />;
      case 4:
        return <Step4Beneficiaries />;
      case 5:
        return <Step5Guardianship />;
      case 6:
        return <div className="p-6">Step 6: Executor Details (Coming Soon)</div>;
      case 7:
        return <div className="p-6">Step 7: Final Provisions (Coming Soon)</div>;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col flex-1 w-full relative">
        {/* Progress Indicator */}
        <StepProgress currentStep={currentStep} completedSteps={completedSteps} />

        {/* Form Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <form onSubmit={handleSubmit(onSubmit as any)}>
            {/* Step Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Save Draft Button */}
                <SaveButton
                  onSave={handleSaveDraft}
                  isPending={isSaving}
                  isDirty={formState.isDirty}
                />

                {/* Next/Submit Button */}
                {currentStep < 7 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#FF5555] text-white"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isSaving ? "Submitting..." : "Submit Will"}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
