"use client";

import { useFormContext, useWatch, Controller } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Step6Executor() {
  const {
    register,
    control,
    watch,
  } = useFormContext<CompleteWillFormData>();

  const remunerationType = useWatch({
    control,
    name: "step6.remuneration",
  });

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
            <CardTitle>Details of Executor</CardTitle>
            <CardDescription>
                An Executor is a person responsible for distributing the assets as per your will.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            
            {/* Primary Executor */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    Primary Executor <span className="text-red-500">*</span>
                </h3>
                <ExecutorForm prefix="step6.primaryExecutor" />
            </div>

            {/* Alternate Executor */}
             <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="alternate-executor" className="border rounded-lg px-4 bg-slate-50">
                    <AccordionTrigger className="hover:no-underline">
                        <span className="text-base font-semibold">Add Alternate Executor (Optional)</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 pb-4">
                        <div className="flex items-center space-x-2 mb-4">
                             <Controller
                                control={control}
                                name="step6.hasAlternateExecutor"
                                render={({ field }) => (
                                    <Checkbox 
                                        id="hasAlternateExecutor" 
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor="hasAlternateExecutor" className="cursor-pointer">
                                Yes, appoint an alternate executor if primary cannot serve
                            </Label>
                        </div>
                        
                        {watch("step6.hasAlternateExecutor") && (
                             <ExecutorForm prefix="step6.alternateExecutor" />
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Executor Powers */}
            <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Executor&apos;s Powers</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <PowerCheckbox 
                        name="step6.powers.canSellProperty" 
                        label="Can sell immovable property" 
                        control={control}
                     />
                     <PowerCheckbox 
                        name="step6.powers.canManageInvestments" 
                        label="Can manage investments" 
                        control={control}
                     />
                     <PowerCheckbox 
                        name="step6.powers.canSettleDebts" 
                        label="Can settle debts and liabilities" 
                        control={control}
                     />
                     <PowerCheckbox 
                        name="step6.powers.canDistributeAssets" 
                        label="Can distribute assets to beneficiaries" 
                        control={control}
                     />
                </div>
            </div>

            {/* Remuneration */}
             <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-semibold">Executor&apos;s Remuneration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Remuneration Type</Label>
                        <Controller
                            control={control}
                            name="step6.remuneration"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Remuneration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="No remuneration">No remuneration</SelectItem>
                                        <SelectItem value="Fixed amount">Fixed amount</SelectItem>
                                        <SelectItem value="Percentage of estate">Percentage of estate</SelectItem>
                                        <SelectItem value="As per legal provisions">As per legal provisions</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    
                    {(remunerationType === "Fixed amount" || remunerationType === "Percentage of estate") && (
                         <div className="space-y-2">
                            <Label>Amount / Percentage</Label>
                            <Input 
                                type="number" 
                                {...register("step6.remunerationAmount", { valueAsNumber: true })} 
                                placeholder={remunerationType === "Fixed amount" ? "Amount (₹)" : "Percentage (%)"}
                            />
                        </div>
                    )}
                </div>
            </div>

        </CardContent>
      </Card>
    </div>
  );
}

// Reusable Executor Form
function ExecutorForm({ prefix }: { prefix: "step6.primaryExecutor" | "step6.alternateExecutor" }) {
    const { register, control, formState: { errors }, setValue, watch } = useFormContext<CompleteWillFormData>();

    // Watch the date of birth to auto-calculate age (used for manual entry handler now)
    // const dob = watch(`${prefix}.dateOfBirth`); // Unused now

    // Helper to calculate age
    const calculateAge = (dateString: string | Date | undefined) => {
        if (!dateString) return 0;
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    // useEffect for auto-calculation removed in favor of direct onChange handler to prevent race conditions

    // Helper to get nested error safely
    const getError = (path: string) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return path.split('.').reduce((obj, key) => obj && (obj as any)[key], errors) as any;
    };

    return (
        <Card className="border-slate-200 shadow-sm bg-white">
            <CardContent className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Select from Family Helper */}
                <div className="md:col-span-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100 mb-2">
                    <Label className="mb-2 block text-blue-900">Select from Family (Optional Auto-fill)</Label>
                    <Select onValueChange={(value) => {
                        const step2 = watch("step2");
                        let selectedPerson = null;

                        if (value === "spouse" && step2.spouse) {
                            selectedPerson = {
                                fullName: step2.spouse.fullName,
                                relationship: "Spouse",
                                dateOfBirth: step2.spouse.dateOfBirth
                            };
                        } else if (value.startsWith("child_")) {
                            const index = parseInt(value.split("_")[1]);
                            const child = step2.children?.[index];
                            if (child) {
                                selectedPerson = {
                                    fullName: child.fullName,
                                    relationship: child.relationship,
                                    dateOfBirth: child.dateOfBirth
                                };
                            }
                        }

                        if (selectedPerson) {
                            setValue(`${prefix}.fullName`, selectedPerson.fullName, { shouldValidate: true, shouldDirty: true });
                            setValue(`${prefix}.relationship`, selectedPerson.relationship, { shouldValidate: true, shouldDirty: true });
                            
                            if (selectedPerson.dateOfBirth) {
                                setValue(`${prefix}.dateOfBirth`, selectedPerson.dateOfBirth, { shouldValidate: true, shouldDirty: true });
                                
                                // Explicitly calculate and set age immediately
                                const age = calculateAge(selectedPerson.dateOfBirth);
                                setValue(`${prefix}.age`, age, { shouldValidate: true, shouldDirty: true });
                            }
                        }
                    }}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select a family member to auto-fill..." />
                        </SelectTrigger>
                        <SelectContent>
                            {watch("step2.isMarried") && watch("step2.spouse.fullName") && (
                                <SelectItem value="spouse">
                                    {watch("step2.spouse.fullName")} (Spouse)
                                </SelectItem>
                            )}
                            {watch("step2.hasChildren") && watch("step2.children")?.map((child, index) => (
                                child.fullName ? (
                                    <SelectItem key={index} value={`child_${index}`}>
                                        {child.fullName} ({child.relationship})
                                    </SelectItem>
                                ) : null
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>Full Name <span className="text-red-500">*</span></Label>
                    <Input {...register(`${prefix}.fullName`)} placeholder="Executor's Name" />
                    {getError(`${prefix}.fullName`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.fullName`).message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Relationship <span className="text-red-500">*</span></Label>
                    <Input {...register(`${prefix}.relationship`)} placeholder="Relationship" />
                     {getError(`${prefix}.relationship`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.relationship`).message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Date of Birth <span className="text-red-500">*</span></Label>
                    <Input 
                        type="date" 
                        {...(() => {
                            const { onChange, ...rest } = register(`${prefix}.dateOfBirth`);
                            return {
                                ...rest,
                                onChange: (e) => {
                                    onChange(e); // Call original react-hook-form handler
                                    const age = calculateAge(e.target.value);
                                    setValue(`${prefix}.age`, age, { shouldValidate: true });
                                }
                            };
                        })()}
                    />
                    {getError(`${prefix}.dateOfBirth`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.dateOfBirth`).message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Age (Auto-calculated)</Label>
                    <Input 
                        type="number" 
                        {...register(`${prefix}.age`, { valueAsNumber: true })} 
                        readOnly 
                        className="bg-gray-50"
                    />
                    {getError(`${prefix}.age`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.age`).message}</p>
                    )}
                </div>

                 <div className="space-y-2">
                    <Label>Mobile Number <span className="text-red-500">*</span></Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        +91
                      </span>
                      <Input 
                        {...register(`${prefix}.mobileNumber`)} 
                        placeholder="9876543210" 
                        maxLength={10}
                        className="rounded-l-none"
                      />
                    </div>
                    {getError(`${prefix}.mobileNumber`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.mobileNumber`).message}</p>
                    )}
                </div>

                 <div className="space-y-2">
                    <Label>Email Address (Optional)</Label>
                    <Input {...register(`${prefix}.emailAddress`)} placeholder="executor@example.com" type="email" />
                     {getError(`${prefix}.emailAddress`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.emailAddress`).message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label>Occupation (Optional)</Label>
                    <Input {...register(`${prefix}.occupation`)} placeholder="Occupation" />
                </div>
                 
                 <div className="space-y-2">
                    <Label>PAN (Optional)</Label>
                    <Input {...register(`${prefix}.panNumber`)} placeholder="ABCDE1234F" className="uppercase" />
                     {getError(`${prefix}.panNumber`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.panNumber`).message}</p>
                    )}
                </div>
                
                {/* Granular Address Fields */}
                <div className="col-span-1 md:col-span-2 space-y-2">
                     <Label>Address Line 1 <span className="text-red-500">*</span></Label>
                    <Input {...register(`${prefix}.address.addressLine1`)} placeholder="House/Flat No, Street" />
                     {getError(`${prefix}.address.addressLine1`) && (
                        <p className="text-sm text-destructive">{getError(`${prefix}.address.addressLine1`).message}</p>
                    )}
                </div>

                 <div className="grid grid-cols-3 gap-2 md:col-span-2">
                        <div className="space-y-2">
                             <Label className="text-xs">City <span className="text-red-500">*</span></Label>
                            <Input placeholder="City" {...register(`${prefix}.address.city`)} />
                             {getError(`${prefix}.address.city`) && (
                                <p className="text-xs text-destructive">{getError(`${prefix}.address.city`).message}</p>
                              )}
                        </div>
                        <div className="space-y-2">
                             <Label className="text-xs">State <span className="text-red-500">*</span></Label>
                             <Input placeholder="State" {...register(`${prefix}.address.state`)} />
                             {getError(`${prefix}.address.state`) && (
                                <p className="text-xs text-destructive">{getError(`${prefix}.address.state`).message}</p>
                              )}
                        </div>
                        <div className="space-y-2">
                             <Label className="text-xs">PIN Code <span className="text-red-500">*</span></Label>
                             <Input placeholder="PIN" {...register(`${prefix}.address.pinCode`)} maxLength={6} />
                              {getError(`${prefix}.address.pinCode`) && (
                                <p className="text-xs text-destructive">{getError(`${prefix}.address.pinCode`).message}</p>
                              )}
                        </div>
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
                                I have informed this person and they have agreed to be the executor.
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

// Helper for Power Checkbox
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PowerCheckbox({ name, label, control }: { name: string, label: string, control: any }) {
    return (
        <div className="flex items-center space-x-2 border p-3 rounded-md">
            <Controller
                control={control}
                name={name}
                render={({ field }) => (
                    <Checkbox 
                        id={name} 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                )}
            />
            <Label htmlFor={name} className="cursor-pointer">{label}</Label>
        </div>
    );
}
