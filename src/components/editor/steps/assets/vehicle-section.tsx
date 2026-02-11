"use client";

import { useFieldArray, useFormContext, Controller, useWatch } from "react-hook-form";
import { Plus, Trash2, Car } from "lucide-react";
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

export function VehicleSection() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step3.vehicles",
  });

  const hasVehicles = useWatch({ control, name: "step3.hasVehicles" });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="step3.hasVehicles"
          render={({ field }) => (
            <Checkbox
              id="hasVehicles"
              checked={!!field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (checked === true) {
                  if (fields.length === 0) {
                    append({
                      vehicleType: "Car",
                      makeModel: "",
                      registrationNumber: "",
                      yearOfPurchase: undefined,
                      approximateValue: undefined,
                    });
                  }
                } else {
                  remove();
                }
              }}
            />
          )}
        />
        <Label htmlFor="hasVehicles" className="text-base font-medium cursor-pointer">
          Do you have any Vehicles (Car, Two-Wheeler, etc.)?
        </Label>
      </div>

      {hasVehicles && (
        <div className="space-y-4 pl-0 sm:pl-6 border-l-0 sm:border-l-2 border-primary/20">
          {fields.map((field, index) => (
            <Card key={field.id} className="relative overflow-hidden bg-white/50 hover:bg-white transition-colors border-l-4 border-l-blue-400">
              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Header & Remove */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-100 rounded-full">
                       <Car className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">Vehicle {index + 1}</h4>
                      <p className="text-xs text-muted-foreground">Registration details</p>
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
                  {/* Vehicle Type */}
                  <div className="space-y-2">
                    <Label>Vehicle Type <span className="text-red-500">*</span></Label>
                    <Select
                      onValueChange={(value) =>
                        setValue(
                          `step3.vehicles.${index}.vehicleType`,
                          value as CompleteWillFormData['step3']['vehicles'][number]['vehicleType']
                        )
                      }
                      defaultValue={field.vehicleType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Car">Car</SelectItem>
                        <SelectItem value="Two-Wheeler">Two-Wheeler</SelectItem>
                        <SelectItem value="Commercial Vehicle">Commercial Vehicle</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Make & Model */}
                  <div className="space-y-2">
                    <Label>Make & Model <span className="text-red-500">*</span></Label>
                    <Input
                      {...register(`step3.vehicles.${index}.makeModel`)}
                      placeholder="e.g. Honda City, Royal Enfield Classic"
                    />
                    {errors.step3?.vehicles?.[index]?.makeModel && (
                      <p className="text-sm text-destructive">{errors.step3.vehicles[index]?.makeModel?.message}</p>
                    )}
                  </div>

                  {/* Registration Number */}
                  <div className="space-y-2">
                    <Label>Registration Number <span className="text-red-500">*</span></Label>
                    <Input
                      {...register(`step3.vehicles.${index}.registrationNumber`)}
                      placeholder="e.g. KA01AB1234"
                    />
                     {errors.step3?.vehicles?.[index]?.registrationNumber && (
                      <p className="text-sm text-destructive">{errors.step3.vehicles[index]?.registrationNumber?.message}</p>
                    )}
                  </div>

                  {/* Year of Purchase */}
                  <div className="space-y-2">
                    <Label>Year of Purchase (Optional)</Label>
                    <Input 
                      type="number"
                      {...register(`step3.vehicles.${index}.yearOfPurchase`, { 
                        setValueAs: (v) => v === "" || v === null || isNaN(v) ? undefined : Number(v)
                      })} 
                      placeholder="e.g. 2020"
                    />
                  </div>

                  {/* Approximate Value */}
                  <div className="space-y-2">
                    <Label>Approximate Value (₹) (Optional)</Label>
                    <Input 
                      type="number"
                      {...register(`step3.vehicles.${index}.approximateValue`, { 
                        setValueAs: (v) => v === "" || v === null || isNaN(v) ? undefined : Number(v)
                      })} 
                      placeholder="Current market value"
                    />
                  </div>
                </div>

              </CardContent>
            </Card>
          ))}

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                vehicleType: "Car",
                makeModel: "",
                registrationNumber: "",
                yearOfPurchase: undefined,
                approximateValue: undefined,
              })
            }
            className="w-full border-dashed"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Another Vehicle
          </Button>
        </div>
      )}
    </div>
  );
}
