"use client";

import { useEffect } from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";


export function Step7AdditionalProvisions() {
  const {
      register,
      control,
      setValue,
      watch,
      formState: { errors }
  } = useFormContext<CompleteWillFormData>();

  // Helper to autoset execution date to today if empty
  const executionDate = watch("step7.dateOfExecution");
  useEffect(() => {
      if (!executionDate) {
          const today = new Date().toISOString().split('T')[0];
          setValue("step7.dateOfExecution", today);
      }
  }, [executionDate, setValue]);

  // Helper to get nested error safely
  const getError = (path: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return path.split('.').reduce((obj, key) => obj && (obj as any)[key], errors) as any;
  };

  return (
      <div className="space-y-8">
          <Card>
              <CardHeader>
                  <CardTitle>Additional Provisions & Witnesses</CardTitle>
                  <CardDescription>
                      Final details to make your will legally valid and comprehensive.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                  
                  {/* Previous Wills */}
                  <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Previous Wills</h3>
                      <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                          <div className="flex items-center space-x-2">
                             <Controller
                                  control={control}
                                  name="step7.revokeAllPreviousWills"
                                  render={({ field }) => (
                                      <Checkbox 
                                          id="revokeAllPreviousWills" 
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                      />
                                  )}
                              />
                              <Label htmlFor="revokeAllPreviousWills" className="cursor-pointer">
                                  I hereby revoke all my previous wills and codicils.
                              </Label>
                          </div>
                      </div>
                  </div>

                  {/* Funeral & Burial */}
                  <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Funeral & Wishes</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label>Funeral Instructions (Optional)</Label>
                              <Textarea 
                                  {...register("step7.funeralInstructions")} 
                                  placeholder="Specific instructions for funeral rites..."
                              />
                          </div>
                          <div className="space-y-2">
                              <Label>Organ Donation (Optional)</Label>
                              <Textarea 
                                  {...register("step7.organDonationWishes")} 
                                  placeholder="Wishes regarding organ donation..."
                              />
                          </div>
                      </div>
                  </div>

                  {/* Witnesses */}
                  <div className="space-y-6 pt-4 border-t">
                      <div>
                          <h3 className="text-lg font-semibold">Witnesses</h3>
                          <p className="text-sm text-muted-foreground">
                              You need two independent witnesses who are not beneficiaries in this will.
                          </p>
                      </div>

                      {/* Witness 1 */}
                      <div className="space-y-4 border p-4 rounded-lg">
                          <h4 className="font-medium">Witness 1 <span className="text-red-500">*</span></h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Full Name <span className="text-red-500">*</span></Label>
                                  <Input {...register("step7.witness1.fullName")} placeholder="Witness Name" />
                                  {getError("step7.witness1.fullName") && (
                                      <p className="text-sm text-destructive">{getError("step7.witness1.fullName").message}</p>
                                  )}
                              </div>
                              <div className="space-y-2">
                                  <Label>Relationship <span className="text-red-500">*</span></Label>
                                  <Input {...register("step7.witness1.relationship")} placeholder="e.g. Friend, Neighbor" />
                                  {getError("step7.witness1.relationship") && (
                                      <p className="text-sm text-destructive">{getError("step7.witness1.relationship").message}</p>
                                  )}
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                  <Label>Address <span className="text-red-500">*</span></Label>
                                  <Input {...register("step7.witness1.address")} placeholder="Full Address" />
                                  {getError("step7.witness1.address") && (
                                      <p className="text-sm text-destructive">{getError("step7.witness1.address").message}</p>
                                  )}
                              </div>
                              <div className="space-y-2">
                                   <Label>Age (Must be 18+) <span className="text-red-500">*</span></Label>
                                  <Input 
                                      type="number" 
                                      {...register("step7.witness1.age", { valueAsNumber: true })} 
                                  />
                                   {getError("step7.witness1.age") && (
                                      <p className="text-sm text-destructive">{getError("step7.witness1.age").message}</p>
                                  )}
                              </div>
                          </div>
                      </div>

                      {/* Witness 2 */}
                      <div className="space-y-4 border p-4 rounded-lg">
                          <h4 className="font-medium">Witness 2 <span className="text-red-500">*</span></h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                  <Label>Full Name <span className="text-red-500">*</span></Label>
                                  <Input {...register("step7.witness2.fullName")} placeholder="Witness Name" />
                                   {getError("step7.witness2.fullName") && (
                                      <p className="text-sm text-destructive">{getError("step7.witness2.fullName").message}</p>
                                  )}
                              </div>
                              <div className="space-y-2">
                                  <Label>Relationship <span className="text-red-500">*</span></Label>
                                  <Input {...register("step7.witness2.relationship")} placeholder="e.g. Colleague" />
                                   {getError("step7.witness2.relationship") && (
                                      <p className="text-sm text-destructive">{getError("step7.witness2.relationship").message}</p>
                                  )}
                              </div>
                              <div className="space-y-2 md:col-span-2">
                                  <Label>Address <span className="text-red-500">*</span></Label>
                                  <Input {...register("step7.witness2.address")} placeholder="Full Address" />
                                   {getError("step7.witness2.address") && (
                                      <p className="text-sm text-destructive">{getError("step7.witness2.address").message}</p>
                                  )}
                              </div>
                              <div className="space-y-2">
                                   <Label>Age (Must be 18+) <span className="text-red-500">*</span></Label>
                                  <Input 
                                      type="number" 
                                      {...register("step7.witness2.age", { valueAsNumber: true })} 
                                  />
                                   {getError("step7.witness2.age") && (
                                      <p className="text-sm text-destructive">{getError("step7.witness2.age").message}</p>
                                  )}
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Execution Details */}
                  <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-semibold">Execution Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                              <Label>Place of Execution <span className="text-red-500">*</span></Label>
                              <Input {...register("step7.placeOfExecution")} placeholder="City/Town" />
                               {getError("step7.placeOfExecution") && (
                                  <p className="text-sm text-destructive">{getError("step7.placeOfExecution").message}</p>
                              )}
                          </div>
                          <div className="space-y-2">
                              <Label>Date of Execution <span className="text-red-500">*</span></Label>
                              <Input type="date" {...register("step7.dateOfExecution")} />
                               {getError("step7.dateOfExecution") && (
                                  <p className="text-sm text-destructive">{getError("step7.dateOfExecution").message}</p>
                              )}
                          </div>
                      </div>
                  </div>

                  {/* Declarations */}
                  <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-semibold">Final Declarations</h3>
                      <div className="space-y-3 bg-amber-50 p-4 rounded-lg border border-amber-100">
                          
                          <div className="flex items-start space-x-2">
                              <Controller
                                  control={control}
                                  name="step7.soundMindDeclaration"
                                  render={({ field }) => (
                                      <Checkbox 
                                          id="soundMind" 
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                      />
                                  )}
                              />
                              <div className="grid gap-1.5 leading-none">
                                  <Label htmlFor="soundMind" className="text-sm font-medium leading-none cursor-pointer">
                                      I declare that I am of sound mind and health. <span className="text-red-500">*</span>
                                  </Label>
                                   {getError("step7.soundMindDeclaration") && (
                                      <p className="text-sm text-destructive">{getError("step7.soundMindDeclaration").message}</p>
                                  )}
                              </div>
                          </div>

                          <div className="flex items-start space-x-2">
                              <Controller
                                  control={control}
                                  name="step7.noUndueInfluenceDeclaration"
                                  render={({ field }) => (
                                      <Checkbox 
                                          id="noUndueInfluence" 
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                      />
                                  )}
                              />
                              <div className="grid gap-1.5 leading-none">
                                  <Label htmlFor="noUndueInfluence" className="text-sm font-medium leading-none cursor-pointer">
                                      I declare that I am making this will voluntarily and without any undue influence or coercion. <span className="text-red-500">*</span>
                                  </Label>
                                   {getError("step7.noUndueInfluenceDeclaration") && (
                                      <p className="text-sm text-destructive">{getError("step7.noUndueInfluenceDeclaration").message}</p>
                                  )}
                              </div>
                          </div>

                          <div className="flex items-start space-x-2">
                              <Controller
                                  control={control}
                                  name="step7.understandingDeclaration"
                                  render={({ field }) => (
                                      <Checkbox 
                                          id="understanding" 
                                          checked={field.value}
                                          onCheckedChange={field.onChange}
                                      />
                                  )}
                              />
                              <div className="grid gap-1.5 leading-none">
                                  <Label htmlFor="understanding" className="text-sm font-medium leading-none cursor-pointer">
                                      I have understood the contents and legal implications of this will. <span className="text-red-500">*</span>
                                  </Label>
                                   {getError("step7.understandingDeclaration") && (
                                      <p className="text-sm text-destructive">{getError("step7.understandingDeclaration").message}</p>
                                  )}
                              </div>
                          </div>

                      </div>
                  </div>

              </CardContent>
          </Card>
      </div>
  );
}
