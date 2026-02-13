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
import { Step2WillDeclaration } from "./steps/step2-will-declaration";
import { Step1TestatorDetails } from "./steps/step1-testator-details";
import { Step3WillExecutors } from "./steps/step3-will-executors";
import { Step4DisputeResolver } from "./steps/step4-dispute-resolver";
import { Step5WitnessDetails } from "./steps/step5-witness-details";
import { Step6Beneficiaries } from "./steps/step6-beneficiaries";
import { Step7Charities } from "./steps/step7-charities";
import { DownloadPDFButton } from "./download-pdf-button";

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
      fatherName: "",
      fatherDateOfBirth: "",
      fatherAadhaar: "",
      fatherPan: "",
      motherName: "",
      motherDateOfBirth: "",
      motherAadhaar: "",
      motherPan: "",
      religion: "",
      occupation: "",
      nationality: "",
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
      soundMind: false,
      revokePriorWills: false,
      signingDate: "",
      signingPlace: "",
    },
    step3: {
      useProfessionalExecutor: false,
      executor: "",
      executorRelationship: "",
      executorFatherName: "",
      executorDateOfBirth: "",
      executorAadhaar: "",
      executorPan: "",
      executorCountryCode: "+91",
      executorPhoneNumber: "",
      executorEmail: "",
      executorAddress: "",
      executorCity: "",
      executorState: "",
      executorCountry: "",
      executorPinCode: "",
      backupExecutor: "",
      backupExecutorRelationship: "",
      backupExecutorFatherName: "",
      backupExecutorDateOfBirth: "",
      backupExecutorAadhaar: "",
      backupExecutorPan: "",
      backupExecutorCountryCode: "+91",
      backupExecutorPhoneNumber: "",
      backupExecutorEmail: "",
      backupExecutorAddress: "",
      backupExecutorCity: "",
      backupExecutorState: "",
      backupExecutorCountry: "",
      backupExecutorPinCode: "",
      banyyanFallbackExecutorOptIn: true,
    },
    step4: {
      disputeResolver: "",
      disputeResolverRelation: "",
      disputeResolverFather: "",
      disputeResolverNationality: "",
      disputeResolverAadhaar: "",
      disputeResolverPan: "",
      disputeResolverPhoneCountryCode: "+91",
      disputeResolverPhoneNumber: "",
      disputeResolverEmail: "",
      disputeResolverAddress: "",
      disputeResolverCity: "",
      disputeResolverState: "",
      disputeResolverCountry: "",
      disputeResolverZipCode: "",
    },
    step5: {
      witnessesKnown: false,
      witness1: {
        name: "",
        aadhaar: "",
        phoneCountryCode: "+91",
        phoneNumber: "",
        email: "",
        father: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      witness2: {
        name: "",
        aadhaar: "",
        phoneCountryCode: "+91",
        phoneNumber: "",
        email: "",
        father: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
    },
    step6: {
      beneficiaries: [
        {
          name: "",
          relation: "",
          dateOfBirth: "",
          age: "",
          pan: "",
          aadhaar: "",
          guardianName: "",
          guardianRelation: "",
        },
      ],
    },
    step7: {
      charities: [],
    },
  };

  const methods = useForm<CompleteWillFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(completeWillSchema) as any,
    mode: "onChange",
    defaultValues: {
      step1: {
        ...defaultFormValues.step1,
        ...(initialData?.step1 || {}),
        // Deep merge nested objects in Step 1
        residentialAddress: {
          ...defaultFormValues.step1?.residentialAddress,
          ...(initialData?.step1?.residentialAddress || {}),
        },
        contactInfo: {
          ...defaultFormValues.step1?.contactInfo,
          ...(initialData?.step1?.contactInfo || {}),
        },
      },
      step2: {
        ...defaultFormValues.step2,
        ...(initialData?.step2 || {}),
      },
      step3: {
        ...defaultFormValues.step3,
        ...(initialData?.step3 || {}),
      },
      step4: {
        ...defaultFormValues.step4,
        ...(initialData?.step4 || {}),
      },
      step5: {
        ...defaultFormValues.step5,
        ...(initialData?.step5 || {}),
      },
      step6: {
        beneficiaries: initialData?.step6?.beneficiaries || defaultFormValues.step6?.beneficiaries || [],
      },
      step7: {
        charities: initialData?.step7?.charities || defaultFormValues.step7?.charities || [],
      },
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
      
      // Log the data attempting to be validated
      const stepKey = `step${currentStep}` as keyof CompleteWillFormData;
      const stepData = methods.getValues(stepKey);
      console.error(`Data for ${stepKey} being validated:`, JSON.stringify(stepData, null, 2));

      // Ensure specific step errors are logged if possible
      console.error(`Specific errors for ${stepKey}:`, methods.formState.errors[stepKey]);
      
      // Log detailed error messages for each field
      const stepErrors = methods.formState.errors[stepKey];
      if (stepErrors && typeof stepErrors === 'object') {
        console.error(`\n=== DETAILED ERRORS FOR ${stepKey.toUpperCase()} ===`);
        
        // Find the first error field to scroll to
        let firstErrorFieldId: string | null = null;
        
        Object.entries(stepErrors).forEach(([fieldName, fieldError]) => {
          if (!firstErrorFieldId) {
             // For step 3, the ID usually matches the field name (e.g. "executor")
             // But the error structure is errors.step3.executor
             // So fieldName is "executor"
             firstErrorFieldId = fieldName;
          }

          if (fieldError && typeof fieldError === 'object') {
            // If it's a nested object (like alternateGuardian), log each sub-field
            console.error(`\n${fieldName}:`);
            Object.entries(fieldError).forEach(([subField, subError]: [string, unknown]) => {
              if (subError && typeof subError === 'object' && 'message' in subError) {
                console.error(`  - ${subField}: ${subError.message}`);
              } else {
                console.error(`  - ${subField}:`, subError);
              }
            });
          } else if (fieldError && typeof fieldError === 'object' && 'message' in fieldError) {
            console.error(`${fieldName}: ${fieldError.message}`);
          }
        });
        console.error(`=== END DETAILED ERRORS ===\n`);
        
        // Scroll to the first error
        if (firstErrorFieldId) {
          // IDs in Step 3 match the field names inside the step object (e.g. "executor", "backupExecutor")
          // We try to find by ID
          const element = document.getElementById(firstErrorFieldId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          } else {
             // Fallback: try to find by name attribute if ID doesn't match
             // The name attribute would be "step3.executor"
             const nameCoded = `${stepKey}.${firstErrorFieldId}`;
             const elementByName = document.getElementsByName(nameCoded)[0];
             if (elementByName) {
                elementByName.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (elementByName as HTMLElement).focus();
             }
          }
        }
      }
      
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
        return <Step2WillDeclaration />;
      case 3:
        return <Step3WillExecutors />;
      case 4:
        return <Step4DisputeResolver />;
      case 5:
        return <Step5WitnessDetails />;
      case 6:
        return <Step6Beneficiaries />;
      case 7:
        return <Step7Charities />;
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
        return (
          <div className="p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Step {currentStep}</h2>
            <p className="text-gray-600 mb-6">This step is coming soon. Please continue to the next step.</p>
            <p className="text-sm text-gray-500">Step {currentStep} will be implemented in a future update.</p>
          </div>
        );
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
                {currentStep < 13 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 bg-[#FF6B6B] hover:bg-[#FF5555] text-white"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  /* Show Download PDF button on Step 13 */
                  willId && <DownloadPDFButton willId={willId} onBeforeDownload={handleSaveDraft} />
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
