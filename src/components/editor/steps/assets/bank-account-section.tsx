"use client";

import { useFieldArray, useFormContext, Controller, useWatch } from "react-hook-form";
import { Plus, Trash2, Landmark, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { CompleteWillFormData } from "@/lib/validations/will";

export function BankAccountSection() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step3.bankAccounts",
  });

  const hasBankAccounts = useWatch({ control, name: "step3.hasBankAccounts" });
  const bankAccounts = useWatch({ control, name: "step3.bankAccounts" });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="step3.hasBankAccounts"
          render={({ field }) => (
            <Checkbox
              id="hasBankAccounts"
              checked={!!field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (checked === true) {
                  if (fields.length === 0) {
                    append({
                      bankName: "",
                      branchName: "",
                      accountType: "Savings",
                      accountNumber: "",
                      accountHolderType: "Single",
                      approximateBalance: 0,
                      nomineeRegistered: false,
                    });
                  }
                } else {
                  remove();
                }
              }}
            />
          )}
        />
        <Label htmlFor="hasBankAccounts" className="text-base font-medium cursor-pointer">
          Do you have any Bank Accounts (Savings, FD, etc.)?
        </Label>
      </div>

      {hasBankAccounts && (
        <div className="space-y-4 pl-0 sm:pl-6 border-l-0 sm:border-l-2 border-primary/20">
          {fields.map((field, index) => {
            const accountHolderType = bankAccounts?.[index]?.accountHolderType;

            return (
            <Card key={field.id} className="relative overflow-hidden bg-white/50 hover:bg-white transition-colors border-l-4 border-l-indigo-400">
              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Header & Remove */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-full">
                       <Landmark className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">Bank Account {index + 1}</h4>
                      <p className="text-xs text-muted-foreground">Details as per passbook</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Details */}
                  <div className="space-y-2">
                    <Label>Bank Name <span className="text-red-500">*</span></Label>
                    <Input
                      {...register(`step3.bankAccounts.${index}.bankName`)}
                      placeholder="e.g. HDFC Bank, SBI"
                    />
                    {errors.step3?.bankAccounts?.[index]?.bankName && (
                      <p className="text-sm text-destructive">{errors.step3.bankAccounts[index]?.bankName?.message}</p>
                    )}
                  </div>
                   <div className="space-y-2">
                    <Label>Branch Name (Optional)</Label>
                    <Input
                      {...register(`step3.bankAccounts.${index}.branchName`)}
                      placeholder="e.g. Indiranagar Branch"
                    />
                  </div>

                  {/* Account Type */}
                   <div className="space-y-2">
                    <Label>Account Type <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(
                          `step3.bankAccounts.${index}.accountType`,
                          value as CompleteWillFormData['step3']['bankAccounts'][number]['accountType']
                        )
                      }
                      defaultValue={field.accountType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Savings">Savings Account</SelectItem>
                        <SelectItem value="Current">Current Account</SelectItem>
                        <SelectItem value="Fixed Deposit">Fixed Deposit (FD)</SelectItem>
                        <SelectItem value="Recurring Deposit">Recurring Deposit (RD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Account Number */}
                  <div className="space-y-2">
                    <Label>Account / FD Number <span className="text-red-500">*</span></Label>
                    <Input
                      {...register(`step3.bankAccounts.${index}.accountNumber`)}
                      placeholder="Enter full account number"
                    />
                     {errors.step3?.bankAccounts?.[index]?.accountNumber && (
                      <p className="text-sm text-destructive">{errors.step3.bankAccounts[index]?.accountNumber?.message}</p>
                    )}
                  </div>
                </div>

                {/* Ownership */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                    <Label>Account Holder Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(
                          `step3.bankAccounts.${index}.accountHolderType`,
                          value as CompleteWillFormData['step3']['bankAccounts'][number]['accountHolderType']
                        )
                      }
                      defaultValue={field.accountHolderType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select holder type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Joint">Joint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                   <div className="space-y-2">
                       <Label>Approx Balance (Optional ₹)</Label>
                       <Input 
                          type="number"
                          {...register(`step3.bankAccounts.${index}.approximateBalance`, { valueAsNumber: true })} 
                       />
                   </div>
                </div>

                {/* Joint Holder Details */}
                {accountHolderType === "Joint" && (
                   <div className="p-4 bg-muted/30 rounded-lg space-y-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Users className="h-3 w-3" /> Joint Holder Name(s)</Label>
                        <Input 
                           {...register(`step3.bankAccounts.${index}.jointHolderNames`)}
                           placeholder="Name of joint holder(s)" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Relationship with Joint Holder</Label>
                        <Input 
                           {...register(`step3.bankAccounts.${index}.jointHolderRelationship`)}
                           placeholder="e.g. Spouse, Father" 
                        />
                      </div>
                   </div>
                )}

                 {/* Nomination */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id={`nominee-${index}`}
                      onCheckedChange={(checked) => {
                        setValue(`step3.bankAccounts.${index}.nomineeRegistered`, checked === true);
                      }}
                       defaultChecked={field.nomineeRegistered}
                    />
                    <Label htmlFor={`nominee-${index}`} className="text-sm">
                      Is a nominee already registered with the bank?
                    </Label>
                  </div>

              </CardContent>
            </Card>
            );
          })}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                bankName: "",
                branchName: "",
                accountType: "Savings",
                accountNumber: "",
                accountHolderType: "Single",
                approximateBalance: 0,
                nomineeRegistered: false,
              })
            }
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Another Bank Account
          </Button>
        </div>
      )}
    </div>
  );
}
