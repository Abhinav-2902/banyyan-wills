"use client";

import { useEffect, useState } from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Step5Guardianship() {
  const {
    control,
    setValue,
    register,
    getValues,
  } = useFormContext<CompleteWillFormData>();

  const [alternateGuardianOpen, setAlternateGuardianOpen] = useState<string | undefined>(undefined);

  // Watch Step 2 children to auto-detect minors
  const children = useWatch({
    control,
    name: "step2.children",
  });

  const hasMinorChildren = useWatch({
    control,
    name: "step5.hasMinorChildren",
  });

  // Auto-set hasMinorChildren based on Step 2
  useEffect(() => {
    if (children && children.length > 0) {
        const minors = children.filter(child => child.isMinor);
        if (minors.length > 0 && hasMinorChildren !== true) {
            setValue("step5.hasMinorChildren", true, { shouldValidate: true });
        }
    }
  }, [children, hasMinorChildren, setValue]);

  // Clear alternate guardian data when accordion is closed
  const handleAccordionChange = (value: string) => {
    console.log("Accordion change - new value:", value);
    console.log("Previous accordion state:", alternateGuardianOpen);
    
    setAlternateGuardianOpen(value);
    
    // If accordion is being closed (value is empty), clear the alternate guardian data
    if (!value) {
      const currentData = getValues("step5.alternateGuardian");
      console.log("Clearing alternate guardian. Current data:", currentData);
      setValue("step5.alternateGuardian", undefined, { shouldValidate: true });
      console.log("Alternate guardian cleared. New value:", getValues("step5.alternateGuardian"));
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Guardianship for Minor Children</CardTitle>
          <CardDescription>
            Appoint a guardian for your minor children (under 18 years) to ensure their care and upbringing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            
            <div className={`flex items-center space-x-2 p-4 rounded-lg border ${
                children?.some(c => c.isMinor) ? "bg-blue-50 border-blue-100" : "bg-gray-50 border-gray-200"
            }`}>
                <Controller
                    control={control}
                    name="step5.hasMinorChildren"
                    render={({ field }) => (
                        <Checkbox 
                            id="hasMinorChildren" 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={children?.some(c => c.isMinor)} // Disable manual uncheck if minors exist
                        />
                    )}
                />
                <div className="grid gap-1.5 leading-none">
                    <Label
                        htmlFor="hasMinorChildren"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                        I have minor children needing a guardian
                    </Label>
                    <p className="text-xs text-muted-foreground">
                        {children?.some(c => c.isMinor) 
                            ? "Automatically selected because you have minor children listed in Step 2." 
                            : "Select this if you have minor children."}
                    </p>
                </div>
            </div>

            {hasMinorChildren && (
                <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    
                    {/* Primary Guardian */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            Primary Guardian <span className="text-red-500">*</span>
                        </h3>
                        <GuardianForm prefix="step5.primaryGuardian" />
                    </div>

                    {/* Alternate Guardian */}
                    <Accordion 
                      type="single" 
                      collapsible 
                      className="w-full"
                      value={alternateGuardianOpen}
                      onValueChange={handleAccordionChange}
                    >
                        <AccordionItem value="alternate-guardian" className="border rounded-lg px-4 bg-slate-50">
                            <AccordionTrigger className="hover:no-underline">
                                <span className="text-base font-semibold">Add Alternate Guardian (Optional)</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 pb-4">
                                <GuardianForm prefix="step5.alternateGuardian" />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

                    {/* Special Instructions */}
                    <Card className="border-dashed">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Special Instructions (Optional)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Instructions for Child Care</Label>
                                <Textarea 
                                    {...register("step5.specialInstructions.childCare")} 
                                    placeholder="Any specific wishes regarding upbringing, lifestyle, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Education Preferences</Label>
                                <Textarea 
                                    {...register("step5.specialInstructions.educationPreferences")} 
                                    placeholder="Preferences for schooling, higher education, etc."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Religious/Cultural Upbringing</Label>
                                <Textarea 
                                    {...register("step5.specialInstructions.religiousCulturalUpbringing")} 
                                    placeholder="Wishes regarding religious or cultural traditions."
                                />
                            </div>
                        </CardContent>
                    </Card>

                </div>
            )}

        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Guardian Form Component
function GuardianForm({ prefix }: { prefix: "step5.primaryGuardian" | "step5.alternateGuardian" }) {
    const { register, control, formState: { errors } } = useFormContext<CompleteWillFormData>();

    // Helper to get nested error safely
    const getError = (path: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return path.split('.').reduce((obj, key) => obj && (obj as any)[key], errors) as any;
    };

    return (
        <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-2">
                    <Label>Full Name <span className="text-red-500">*</span></Label>
                    <Input {...register(`${prefix}.fullName`)} placeholder="Guardian's Name" />
                    {getError(`${prefix}.fullName`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.fullName`).message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Relationship <span className="text-red-500">*</span></Label>
                    <Input {...register(`${prefix}.relationship`)} placeholder="e.g. Brother, Aunt, Friend" />
                     {getError(`${prefix}.relationship`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.relationship`).message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Date of Birth <span className="text-red-500">*</span></Label>
                    <Input type="date" {...register(`${prefix}.dateOfBirth`)} />
                    {getError(`${prefix}.dateOfBirth`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.dateOfBirth`).message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Mobile Number <span className="text-red-500">*</span></Label>
                    <Input {...register(`${prefix}.mobileNumber`)} placeholder="+91 9876543210" maxLength={15} />
                    {getError(`${prefix}.mobileNumber`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.mobileNumber`).message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Email Address (Optional)</Label>
                    <Input {...register(`${prefix}.emailAddress`)} placeholder="guardian@example.com" type="email" />
                     {getError(`${prefix}.emailAddress`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.emailAddress`).message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Occupation (Optional)</Label>
                    <Input {...register(`${prefix}.occupation`)} placeholder="e.g. Teacher, Engineer" />
                </div>

                <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label>Address <span className="text-red-500">*</span></Label>
                    <Textarea {...register(`${prefix}.address`)} placeholder="Full residential address" className="min-h-[80px]" />
                     {getError(`${prefix}.address`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.address`).message}</p>
                    )}
                </div>
                
                 <div className="col-span-1 md:col-span-2 pt-2">
                    <div className="flex items-start space-x-2">
                        <Controller
                            control={control}
                            name={`${prefix}.consentObtained`}
                            render={({ field }) => (
                                <Checkbox 
                                    id={`${prefix}.consentObtained`} 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <div className="grid gap-1.5 leading-none">
                            <Label
                                htmlFor={`${prefix}.consentObtained`}
                                className="text-sm font-medium leading-none cursor-pointer"
                            >
                                I confirm verification and consent <span className="text-red-500">*</span>
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                I have informed this person and they have agreed to be the guardian.
                            </p>
                             {getError(`${prefix}.consentObtained`) && (
                                <p className="text-sm text-destructive">{getError(`${prefix}.consentObtained`).message}</p>
                            )}
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    );
}
