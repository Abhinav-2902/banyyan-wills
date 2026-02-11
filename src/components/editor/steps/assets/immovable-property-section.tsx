"use client";

import { useFieldArray, useFormContext, Controller, useWatch } from "react-hook-form";
import { Plus, Trash2, Home, MapPin, FileText, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function ImmovablePropertySection() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step3.immovableProperties",
  });

  const hasProperty = useWatch({ control, name: "step3.hasImmovableProperty" });

  // Watch fields for conditional rendering (careful with performance in large lists, but fine here)
  const properties = useWatch({ control, name: "step3.immovableProperties" });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="step3.hasImmovableProperty"
          render={({ field }) => (
            <Checkbox
              id="hasImmovableProperty"
              checked={!!field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (checked === true) {
                  if (fields.length === 0) {
                    append({
                      propertyType: "Apartment/Flat",
                      description: "",
                      address: {
                        addressLine1: "",
                        city: "",
                        state: "",
                        pinCode: "",
                      },
                      ownershipType: "Sole Owner",
                      areaSize: 0,
                      areaUnit: "Sq. Ft.",
                      hasLoan: false,
                    });
                  }
                } else {
                  remove();
                }
              }}
            />
          )}
        />
        <Label htmlFor="hasImmovableProperty" className="text-base font-medium cursor-pointer">
          Do you own any immovable property (Real Estate)?
        </Label>
      </div>

      {hasProperty && (
        <div className="space-y-4 pl-0 sm:pl-6 border-l-0 sm:border-l-2 border-primary/20">
          {fields.map((field, index) => {
            const ownershipType = properties?.[index]?.ownershipType;
            const hasLoan = properties?.[index]?.hasLoan;

            return (
            <Card key={field.id} className="relative overflow-hidden bg-white/50 hover:bg-white transition-colors border-l-4 border-l-primary/40">
              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Header & Remove */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-full">
                       <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">Property {index + 1}</h4>
                      <p className="text-xs text-muted-foreground">Enter details as per title deed</p>
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
                  {/* Property Type */}
                  <div className="space-y-2">
                    <Label>Property Type <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(
                          `step3.immovableProperties.${index}.propertyType`,
                          value as CompleteWillFormData['step3']['immovableProperties'][number]['propertyType']
                        )
                      }
                      defaultValue={field.propertyType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Residential House">Residential House</SelectItem>
                        <SelectItem value="Apartment/Flat">Apartment/Flat</SelectItem>
                        <SelectItem value="Commercial Property">Commercial Property</SelectItem>
                        <SelectItem value="Agricultural Land">Agricultural Land</SelectItem>
                        <SelectItem value="Plot/Land">Plot/Land</SelectItem>
                        <SelectItem value="Ancestral Property">Ancestral Property</SelectItem>
                      </SelectContent>
                    </Select>
                     {errors.step3?.immovableProperties?.[index]?.propertyType && (
                      <p className="text-sm text-destructive">{errors.step3.immovableProperties[index]?.propertyType?.message}</p>
                    )}
                  </div>

                  {/* Ownership Type */}
                  <div className="space-y-2">
                    <Label>Ownership Type <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) =>
                         setValue(
                          `step3.immovableProperties.${index}.ownershipType`,
                          value as CompleteWillFormData['step3']['immovableProperties'][number]['ownershipType']
                        )
                      }
                      defaultValue={field.ownershipType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ownership" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Sole Owner">Sole Owner</SelectItem>
                        <SelectItem value="Joint Owner">Joint Owner</SelectItem>
                        <SelectItem value="Co-owner">Co-owner</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Conditional Ownership Fields */}
                {(ownershipType === "Joint Owner" || ownershipType === "Co-owner") && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Users className="h-3 w-3" /> Co-Owner Names</Label>
                        <Input 
                           {...register(`step3.immovableProperties.${index}.coOwnerNames`)}
                           placeholder="e.g. Spouse Name, Sibling Name" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Your Share Percentage (%)</Label>
                        <Input 
                           type="number"
                           {...register(`step3.immovableProperties.${index}.sharePercentage`, { 
                             setValueAs: (v) => v === "" || v === null || isNaN(v) ? undefined : Number(v)
                           })}
                           placeholder="50" 
                           max={100}
                        />
                      </div>
                   </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <Label>Description <span className="text-red-500">*</span></Label>
                  <Textarea
                    {...register(`step3.immovableProperties.${index}.description`)}
                    placeholder="Brief description e.g. 3BHK Apartment on 4th Floor..."
                    className="min-h-[80px]"
                  />
                  {errors.step3?.immovableProperties?.[index]?.description && (
                      <p className="text-sm text-destructive">{errors.step3.immovableProperties[index]?.description?.message}</p>
                    )}
                </div>

                {/* Address Section */}
                <div className="space-y-4 border rounded-lg p-4 bg-gray-50/50">
                  <h5 className="font-medium text-sm flex items-center gap-2 text-gray-700">
                    <MapPin className="h-4 w-4" /> Location Details
                  </h5>
                  <div className="space-y-2">
                    <Label>Address Line 1 <span className="text-red-500">*</span></Label>
                    <Input
                      {...register(`step3.immovableProperties.${index}.address.addressLine1`)}
                      placeholder="Door No, Building Name, Street"
                    />
                     {errors.step3?.immovableProperties?.[index]?.address?.addressLine1 && (
                      <p className="text-sm text-destructive">{errors.step3.immovableProperties[index]?.address?.addressLine1?.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City <span className="text-red-500">*</span></Label>
                      <Input {...register(`step3.immovableProperties.${index}.address.city`)} />
                      {errors.step3?.immovableProperties?.[index]?.address?.city && (
                        <p className="text-sm text-destructive">{errors.step3.immovableProperties[index]?.address?.city?.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>State <span className="text-red-500">*</span></Label>
                      <Input {...register(`step3.immovableProperties.${index}.address.state`)} />
                      {errors.step3?.immovableProperties?.[index]?.address?.state && (
                        <p className="text-sm text-destructive">{errors.step3.immovableProperties[index]?.address?.state?.message}</p>
                      )}
                    </div>
                     <div className="space-y-2">
                      <Label>PIN Code <span className="text-red-500">*</span></Label>
                      <Input 
                        {...register(`step3.immovableProperties.${index}.address.pinCode`)} 
                        maxLength={6} 
                      />
                      {errors.step3?.immovableProperties?.[index]?.address?.pinCode && (
                        <p className="text-sm text-destructive">{errors.step3.immovableProperties[index]?.address?.pinCode?.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Area & Value */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div className="space-y-2">
                    <Label>Area Size & Unit <span className="text-red-500">*</span></Label>
                    <div className="flex gap-2">
                       <Input 
                          type="number" 
                          {...register(`step3.immovableProperties.${index}.areaSize`, { 
                            setValueAs: (v) => v === "" || isNaN(v) ? undefined : Number(v)
                          })} 
                          placeholder="Size"
                       />
                       <Select
                          onValueChange={(value) =>
                            setValue(`step3.immovableProperties.${index}.areaUnit`, value as CompleteWillFormData['step3']['immovableProperties'][number]['areaUnit'])
                          }
                          defaultValue={field.areaUnit || "Sq. Ft."}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                             <SelectItem value="Sq. Ft.">Sq. Ft.</SelectItem>
                             <SelectItem value="Sq. Meters">Sq. Mtrs</SelectItem>
                             <SelectItem value="Acres">Acres</SelectItem>
                             <SelectItem value="Hectares">Hectares</SelectItem>
                             <SelectItem value="Guntas">Guntas</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    {errors.step3?.immovableProperties?.[index]?.areaSize && (
                      <p className="text-sm text-destructive">{errors.step3.immovableProperties[index]?.areaSize?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Survey/Plot No.</Label>
                     <Input {...register(`step3.immovableProperties.${index}.surveyPlotNumber`)} />
                  </div>
                   <div className="space-y-2">
                    <Label>Value (Approx ₹)</Label>
                    <Input 
                      type="number"
                      {...register(`step3.immovableProperties.${index}.approximateValue`, { 
                        setValueAs: (v) => v === "" || v === null || isNaN(v) ? undefined : Number(v)
                      })} 
                      placeholder="Current Market Value"
                    />
                  </div>
                </div>

                {/* Legal / Advanced Details */}
                 <Accordion type="single" collapsible className="w-full bg-white rounded-lg border">
                  <AccordionItem value="legal-details" className="border-b-0">
                    <AccordionTrigger className="px-4 py-2 text-sm hover:bg-gray-50 text-muted-foreground hover:no-underline rounded-t-lg">
                       <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Registration & Legal Details (Optional)</span>
                    </AccordionTrigger>
                    <AccordionContent className="p-4 space-y-4 border-t">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Document No.</Label>
                            <Input {...register(`step3.immovableProperties.${index}.propertyDocumentNumber`)} placeholder="e.g. 1234/2010" />
                          </div>
                          <div className="space-y-2">
                            <Label>Sub-Registrar Office</Label>
                            <Input {...register(`step3.immovableProperties.${index}.subRegistrarOffice`)} placeholder="e.g. Gandhinagar" />
                          </div>
                       </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Loan Section */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`hasLoan-${index}`}
                      checked={hasLoan}
                      onCheckedChange={(checked) => {
                        setValue(`step3.immovableProperties.${index}.hasLoan`, checked === true);
                        // Clear loan details when unchecked
                        if (!checked) {
                          setValue(`step3.immovableProperties.${index}.loanDetails`, undefined);
                        }
                      }}
                    />
                    <Label htmlFor={`hasLoan-${index}`} className="text-sm font-medium">
                      Is there an outstanding loan on this property?
                    </Label>
                  </div>

                  {hasLoan && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-orange-200">
                      <div className="space-y-2">
                        <Label>Bank/Lender Name</Label>
                         <Input {...register(`step3.immovableProperties.${index}.loanDetails.bankName`)} />
                      </div>
                      <div className="space-y-2">
                         <Label>Outstanding Amount (₹)</Label>
                         <Input 
                            type="number"
                            {...register(`step3.immovableProperties.${index}.loanDetails.outstandingAmount`, { 
                              setValueAs: (v) => v === "" || v === null || isNaN(v) ? undefined : Number(v)
                            })} 
                         />
                      </div>
                    </div>
                  )}
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
                propertyType: "Apartment/Flat",
                description: "",
                 address: {
                  addressLine1: "",
                  city: "",
                  state: "",
                  pinCode: "",
                },
                ownershipType: "Sole Owner",
                areaSize: 0,
                areaUnit: "Sq. Ft.",
                hasLoan: false,
              })
            }
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Another Property
          </Button>
        </div>
      )}
    </div>
  );
}
