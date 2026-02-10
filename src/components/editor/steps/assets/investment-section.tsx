"use client";

import { useFieldArray, useFormContext, Controller, useWatch } from "react-hook-form";
import { Plus, Trash2, TrendingUp } from "lucide-react";
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

export function InvestmentSection() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step3.investments",
  });

  const hasInvestments = useWatch({ control, name: "step3.hasInvestments" });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="step3.hasInvestments"
          render={({ field }) => (
            <Checkbox
              id="hasInvestments"
              checked={!!field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (checked === true) {
                  if (fields.length === 0) {
                    append({
                      investmentType: "Stocks/Shares",
                      description: "",
                      institutionCompanyName: "",
                      folioAccountPolicyNumber: "",
                      approximateValue: 0,
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
        <Label htmlFor="hasInvestments" className="text-base font-medium cursor-pointer">
          Do you have any Investments (Shares, MF, Insurance, etc.)?
        </Label>
      </div>

      {hasInvestments && (
        <div className="space-y-4 pl-0 sm:pl-6 border-l-0 sm:border-l-2 border-primary/20">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative overflow-hidden bg-white/50 hover:bg-white transition-colors border-l-4 border-l-green-400">
              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Header & Remove */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-100 rounded-full">
                       <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">Investment {index + 1}</h4>
                      <p className="text-xs text-muted-foreground">Portfolio details</p>
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
                   {/* Investment Type */}
                   <div className="space-y-2">
                    <Label>Investment Type <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(
                          `step3.investments.${index}.investmentType`,
                          value as CompleteWillFormData['step3']['investments'][number]['investmentType']
                        )
                      }
                      defaultValue={field.investmentType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stocks/Shares">Stocks/Shares</SelectItem>
                        <SelectItem value="Mutual Funds">Mutual Funds</SelectItem>
                        <SelectItem value="Bonds">Bonds</SelectItem>
                        <SelectItem value="PPF">PPF</SelectItem>
                        <SelectItem value="NSC">NSC</SelectItem>
                        <SelectItem value="Post Office Schemes">Post Office Schemes</SelectItem>
                        <SelectItem value="Insurance Policies">Insurance Policies</SelectItem>
                        <SelectItem value="EPF/PF">EPF/PF</SelectItem>
                        <SelectItem value="Gratuity">Gratuity</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                     {errors.step3?.investments?.[index]?.investmentType && (
                      <p className="text-sm text-destructive">{errors.step3.investments[index]?.investmentType?.message}</p>
                    )}
                  </div>

                  {/* Institution / Company Name */}
                  <div className="space-y-2">
                    <Label>Institution/Company Name <span className="text-red-500">*</span></Label>
                    <Input
                      {...register(`step3.investments.${index}.institutionCompanyName`)}
                      placeholder="e.g. Reliance, HDFC MF, LIC"
                    />
                     {errors.step3?.investments?.[index]?.institutionCompanyName && (
                      <p className="text-sm text-destructive">{errors.step3.investments[index]?.institutionCompanyName?.message}</p>
                    )}
                  </div>

                  {/* Folio / Policy Number */}
                  <div className="space-y-2">
                    <Label>Folio / Policy / Account No. (Optional)</Label>
                    <Input
                      {...register(`step3.investments.${index}.folioAccountPolicyNumber`)}
                      placeholder="Unique Identification Number"
                    />
                  </div>

                   {/* Description */}
                   <div className="space-y-2">
                       <Label>Description <span className="text-red-500">*</span></Label>
                       <Input 
                          {...register(`step3.investments.${index}.description`)} 
                          placeholder="e.g. 100 shares of Reliance Industries"
                       />
                       {errors.step3?.investments?.[index]?.description && (
                          <p className="text-sm text-destructive">{errors.step3.investments[index]?.description?.message}</p>
                        )}
                   </div>

                   {/* Value */}
                   <div className="space-y-2">
                       <Label>Approx Value (₹)</Label>
                       <Input 
                          type="number"
                          {...register(`step3.investments.${index}.approximateValue`, { valueAsNumber: true })} 
                          placeholder="Current Market Value"
                       />
                   </div>
                </div>

                 {/* Nomination */}
                  <div className="flex items-center space-x-2 pt-2">
                    <Checkbox
                      id={`nominee-inv-${index}`}
                      onCheckedChange={(checked) => {
                        setValue(`step3.investments.${index}.nomineeRegistered`, checked === true);
                      }}
                       defaultChecked={field.nomineeRegistered}
                    />
                    <Label htmlFor={`nominee-inv-${index}`} className="text-sm">
                      Is a nominee already registered effectively?
                    </Label>
                  </div>

              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                investmentType: "Stocks/Shares",
                description: "",
                institutionCompanyName: "",
                folioAccountPolicyNumber: "",
                approximateValue: 0,
                nomineeRegistered: false,
              })
            }
            className="w-full border-dashed"
          >
             <Plus className="mr-2 h-4 w-4" /> Add Another Investment
          </Button>
        </div>
      )}
    </div>
  );
}
