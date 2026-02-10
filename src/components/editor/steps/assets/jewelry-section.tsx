"use client";

import { useFormContext, Controller, useWatch } from "react-hook-form";
import { Gem } from "lucide-react"; // 'Watch' icon for jewelry/valuables
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { CompleteWillFormData } from "@/lib/validations/will";

export function JewelrySection() {
  const {
    register,
    formState: { errors },
    setValue,
    unregister,
    control,
  } = useFormContext<CompleteWillFormData>();

  const hasJewelry = useWatch({ control, name: "step3.hasJewelryValuables" });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="step3.hasJewelryValuables"
          render={({ field }) => (
            <Checkbox
              id="hasJewelryValuables"
              checked={!!field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (!checked) {
                   unregister("step3.jewelryValuables");
                } else {
                   setValue("step3.jewelryValuables", { description: "", approximateValue: 0, locationStorage: "" }, { shouldValidate: true });
                }
              }}
            />
          )}
        />
        <Label htmlFor="hasJewelryValuables" className="text-base font-medium cursor-pointer">
          Do you have any Jewelry or Precious Valuables?
        </Label>
      </div>

      {hasJewelry && (
        <div className="space-y-4 pl-0 sm:pl-6 border-l-0 sm:border-l-2 border-primary/20">
            <Card className="relative overflow-hidden bg-white/50 hover:bg-white transition-colors border-l-4 border-l-amber-400">
              <CardContent className="p-4 sm:p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 rounded-full">
                       <Gem className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base">Jewelry & Valuables</h4>
                      <p className="text-xs text-muted-foreground">List major items and their location</p>
                    </div>
                  </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Description */}
                  <div className="space-y-2">
                    <Label>Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      {...register("step3.jewelryValuables.description")}
                      placeholder="e.g. 1. Gold Necklace (approx 20g), 2. Diamond ring, 3. Silver plates set..."
                      className="min-h-[100px]"
                    />
                     {errors.step3?.jewelryValuables?.description && (
                      <p className="text-sm text-destructive">{errors.step3.jewelryValuables.description.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {/* Location */}
                       <div className="space-y-2">
                           <Label>Location / Storage</Label>
                           <Input 
                              {...register("step3.jewelryValuables.locationStorage")} 
                              placeholder="e.g. Bank Locker No. 123, Home Safe"
                           />
                       </div>

                       {/* Value */}
                       <div className="space-y-2">
                           <Label>Approx Total Value (₹)</Label>
                           <Input 
                              type="number"
                              {...register("step3.jewelryValuables.approximateValue", { valueAsNumber: true })} 
                              placeholder="Total Value"
                           />
                       </div>
                   </div>
                </div>

              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
