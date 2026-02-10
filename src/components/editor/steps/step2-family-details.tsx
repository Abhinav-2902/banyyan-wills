"use client";

import React from "react";
import { useFormContext, useFieldArray, Controller, useWatch } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, User } from "lucide-react";

export function Step2FamilyDetails() {
  return (
    <div className="space-y-8">
      <SpouseSection />
      <ChildrenSection />
      <ParentsSection />
      <SiblingsSection />
    </div>
  );
}

function SpouseSection() {
  const {
    register,
    control,
    clearErrors,
    unregister,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const isMarried = useWatch({
    control,
    name: "step2.isMarried",
  });

  // Clear spouse data when isMarried changes to false
  React.useEffect(() => {
    if (isMarried === false) {
      // Unregister all spouse fields to completely remove them from form state
      unregister("step2.spouse");
      clearErrors("step2.spouse");
    }
  }, [isMarried, unregister, clearErrors]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Marital Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          control={control}
          name="step2.isMarried"
          render={({ field }) => (
            <div className="flex items-center space-x-4">
              <Label className="text-base">Are you currently married?</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => {
                        field.onChange(false);
                        // Note: useEffect will handle cleanup
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>No</span>
                </label>
              </div>
              {errors.step2?.isMarried && (
                <p className="text-sm text-red-500">{errors.step2.isMarried.message}</p>
              )}
            </div>
          )}
        />

        {isMarried && (
          <div className="border-t pt-4 mt-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <h3 className="font-medium text-gray-900">Spouse Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Spouse&apos;s Full Name</Label>
                <Input {...register("step2.spouse.fullName")} placeholder="Spouse's Name" />
                {errors.step2?.spouse?.fullName && (
                  <p className="text-sm text-red-500">{errors.step2.spouse.fullName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" {...register("step2.spouse.dateOfBirth")} />
                {errors.step2?.spouse?.dateOfBirth && (
                  <p className="text-sm text-red-500">{errors.step2.spouse.dateOfBirth.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Marriage Date</Label>
                <Input type="date" {...register("step2.spouse.marriageDate")} />
                {errors.step2?.spouse?.marriageDate && (
                  <p className="text-sm text-red-500">{errors.step2.spouse.marriageDate.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>PAN (Optional)</Label>
                <Input {...register("step2.spouse.panNumber")} placeholder="ABCDE1234F" className="uppercase" />
              </div>
              
              <div className="flex items-center space-x-2 md:col-span-2">
                 <input
                  type="checkbox"
                  id="isSecondMarriage"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  {...register("step2.spouse.isSecondMarriage")}
                />
                <Label htmlFor="isSecondMarriage" className="font-normal cursor-pointer">
                  Is this a second marriage?
                </Label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChildrenSection() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const hasChildren = useWatch({
    control,
    name: "step2.hasChildren",
  });

  const {
    fields: childFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: "step2.children",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Children</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          control={control}
          name="step2.hasChildren"
          render={({ field }) => (
            <div className="flex items-center space-x-4">
              <Label className="text-base">Do you have children?</Label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={field.value === false}
                    onChange={() => {
                      field.onChange(false);
                      setValue("step2.children", []); // Clear children if No
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          )}
        />

        {hasChildren && (
          <div className="space-y-4">
            {childFields.map((field, index) => (
              <div key={field.id} className="relative p-4 border rounded-lg bg-gray-50/50">
                <div className="absolute right-4 top-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChild(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <User className="w-4 h-4" /> Child {index + 1}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      {...register(`step2.children.${index}.fullName` as const)}
                      placeholder="Child's Name"
                    />
                    {errors.step2?.children?.[index]?.fullName && (
                      <p className="text-sm text-red-500">{errors.step2.children[index]?.fullName?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      {...register(`step2.children.${index}.dateOfBirth` as const)}
                    />
                     {errors.step2?.children?.[index]?.dateOfBirth && (
                      <p className="text-sm text-red-500">{errors.step2.children[index]?.dateOfBirth?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select
                      onValueChange={(value) => setValue(`step2.children.${index}.gender`, value as "Male" | "Female" | "Other", { shouldValidate: true })}
                      defaultValue={watch(`step2.children.${index}.gender`)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                     {errors.step2?.children?.[index]?.gender && (
                      <p className="text-sm text-red-500">{errors.step2.children[index]?.gender?.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select
                      onValueChange={(value) => setValue(`step2.children.${index}.relationship`, value as "Biological Son" | "Biological Daughter" | "Adopted Son" | "Adopted Daughter" | "Stepson" | "Stepdaughter", { shouldValidate: true })}
                      defaultValue={watch(`step2.children.${index}.relationship`)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Relationship" />
                      </SelectTrigger>
                       <SelectContent>
                          <SelectItem value="Biological Son">Biological Son</SelectItem>
                          <SelectItem value="Biological Daughter">Biological Daughter</SelectItem>
                          <SelectItem value="Adopted Son">Adopted Son</SelectItem>
                          <SelectItem value="Adopted Daughter">Adopted Daughter</SelectItem>
                          <SelectItem value="Stepson">Stepson</SelectItem>
                          <SelectItem value="Stepdaughter">Stepdaughter</SelectItem>
                        </SelectContent>
                    </Select>
                     {errors.step2?.children?.[index]?.relationship && (
                      <p className="text-sm text-red-500">{errors.step2.children[index]?.relationship?.message}</p>
                    )}
                  </div>

                   <div className="flex items-center space-x-2 md:col-span-2 pt-2">
                      <input
                        type="checkbox"
                        id={`isMinor-${index}`}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        {...register(`step2.children.${index}.isMinor` as const)}
                      />
                      <Label htmlFor={`isMinor-${index}`} className="font-normal cursor-pointer">
                        Is this child a minor (under 18 years)?
                      </Label>
                    </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => appendChild({ 
                  fullName: "", 
                  dateOfBirth: "", 
                  gender: "Male",
                  relationship: "Biological Son",
                  isMinor: false,
                  panNumber: "",
                  aadhaarNumber: "",
                  currentAddress: ""
              })}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Child
            </Button>
             {hasChildren && childFields.length === 0 && (
              <p className="text-sm text-amber-600">Please add at least one child if you selected &quot;Yes&quot;.</p>
             )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ParentsSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parents Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Father */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 border-b pb-2">Father&apos;s Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Father&apos;s Name</Label>
              <Input {...register("step2.father.name")} placeholder="Father's Name" />
              {errors.step2?.father?.name && (
                <p className="text-sm text-red-500">{errors.step2.father.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                onValueChange={(value) => setValue("step2.father.status", value as "Alive" | "Deceased", { shouldValidate: true })}
                defaultValue={watch("step2.father.status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alive">Alive</SelectItem>
                  <SelectItem value="Deceased">Deceased</SelectItem>
                </SelectContent>
              </Select>
               {errors.step2?.father?.status && (
                <p className="text-sm text-red-500">{errors.step2.father.status.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Mother */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 border-b pb-2">Mother&apos;s Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label>Mother&apos;s Name</Label>
              <Input {...register("step2.mother.name")} placeholder="Mother's Name" />
               {errors.step2?.mother?.name && (
                <p className="text-sm text-red-500">{errors.step2.mother.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
               <Select
                onValueChange={(value) => setValue("step2.mother.status", value as "Alive" | "Deceased", { shouldValidate: true })}
                defaultValue={watch("step2.mother.status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Alive">Alive</SelectItem>
                  <SelectItem value="Deceased">Deceased</SelectItem>
                </SelectContent>
              </Select>
               {errors.step2?.mother?.status && (
                <p className="text-sm text-red-500">{errors.step2.mother.status.message}</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SiblingsSection() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const hasSiblings = useWatch({
    control,
    name: "step2.hasSiblings",
  });

  const {
    fields: siblingFields,
    append: appendSibling,
    remove: removeSibling,
  } = useFieldArray({
    control,
    name: "step2.siblings",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Siblings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Controller
          control={control}
          name="step2.hasSiblings"
          render={({ field }) => (
            <div className="flex items-center space-x-4">
              <Label className="text-base">Do you have siblings?</Label>
              <div className="flex items-center space-x-4">
                 <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={field.value === true}
                    onChange={() => field.onChange(true)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>Yes</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={field.value === false}
                     onChange={() => {
                      field.onChange(false);
                      setValue("step2.siblings", []); // Clear siblings if No
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span>No</span>
                </label>
              </div>
            </div>
          )}
        />

        {hasSiblings && (
          <div className="space-y-4">
            {siblingFields.map((field, index) => (
              <div key={field.id} className="relative p-4 border rounded-lg bg-gray-50/50">
                 <div className="absolute right-4 top-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSibling(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <h4 className="font-medium mb-3">Sibling {index + 1}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      {...register(`step2.siblings.${index}.fullName` as const)}
                      placeholder="Sibling's Name"
                    />
                     {errors.step2?.siblings?.[index]?.fullName && (
                      <p className="text-sm text-red-500">{errors.step2.siblings[index]?.fullName?.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                     <Select
                      onValueChange={(value) => setValue(`step2.siblings.${index}.relationship`, value as "Brother" | "Sister", { shouldValidate: true })}
                      defaultValue={watch(`step2.siblings.${index}.relationship`)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Brother">Brother</SelectItem>
                        <SelectItem value="Sister">Sister</SelectItem>
                      </SelectContent>
                    </Select>
                     {errors.step2?.siblings?.[index]?.relationship && (
                      <p className="text-sm text-red-500">{errors.step2.siblings[index]?.relationship?.message}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => appendSibling({ fullName: "", relationship: "Brother" })}
              className="w-full border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Sibling
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
