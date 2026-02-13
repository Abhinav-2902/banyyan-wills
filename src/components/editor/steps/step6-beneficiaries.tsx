"use client";

import { useFormContext, useFieldArray, useWatch, Control, FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, Plus, Trash2 } from "lucide-react";

export function Step6Beneficiaries() {
  const {
    register,
    control,
    formState: { errors },
    setValue,
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step6.beneficiaries",
  });

  const addBeneficiary = () => {
    append({
      name: "",
      relation: "",
      dateOfBirth: "",
      age: "",
      pan: "",
      aadhaar: "",
      guardianName: "",
      guardianRelation: "",
    });
  };

  const removeBeneficiary = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm rounded-lg">
        <p className="text-sm text-gray-800">
          Beneficiaries are the people or organizations who will receive your assets. Add each beneficiary with their full legal name, relationship, and date of birth. If a beneficiary is under 18, guardian details will be required automatically.
        </p>
      </div>

      {fields.map((field, index) => (
        <BeneficiaryCard
          key={field.id}
          index={index}
          control={control}
          register={register}
          setValue={setValue}
          errors={errors}
          removeBeneficiary={removeBeneficiary}
          canRemove={fields.length > 1}
        />
      ))}

      {/* Add Beneficiary Button */}
      <button
        type="button"
        onClick={addBeneficiary}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#8B7BB8] to-[#432371] text-white rounded-lg hover:from-[#7A6BA7] hover:to-[#3A1F61] transition-all"
      >
        <Plus className="h-5 w-5" />
        Add Another Beneficiary
      </button>
    </div>
  );
}

// Separate component for each beneficiary card
function BeneficiaryCard({
  index,
  control,
  register,
  setValue,
  errors,
  removeBeneficiary,
  canRemove,
}: {
  index: number;
  control: Control<CompleteWillFormData>;
  register: UseFormRegister<CompleteWillFormData>;
  setValue: UseFormSetValue<CompleteWillFormData>;
  errors: FieldErrors<CompleteWillFormData>;
  removeBeneficiary: (index: number) => void;
  canRemove: boolean;
}) {
  const age = useWatch({
    control,
    name: `step6.beneficiaries.${index}.age`,
    defaultValue: "",
  });
  const isMinor = parseInt(age || "0") < 18 && age !== "";

  const calculateAge = (dob: string): string => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? String(age) : "0";
  };

  return (
    <section className="bg-white p-8 rounded-lg shadow-md border border-[#F8D4B8]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
            <Users className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#5E4B8C]">Beneficiary {index + 1}</h2>
        </div>
        {canRemove && (
          <button
            type="button"
            onClick={() => removeBeneficiary(index)}
            className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        )}
      </div>
      <p className="text-sm text-gray-600 -mt-2 mb-4">
        Provide the beneficiary&apos;s full legal name, relation, and date of birth. If the person is under 18, guardian details will be required automatically.
      </p>

      <div className="space-y-4">
        {/* Name and Relation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor={`beneficiary-${index}-name`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`beneficiary-${index}-name`}
              {...register(`step6.beneficiaries.${index}.name`)}
              placeholder="Enter full name"
              className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
            />
            {errors.step6?.beneficiaries?.[index]?.name && (
              <p className="text-sm text-red-500 mt-1">{errors.step6.beneficiaries[index]?.name?.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor={`beneficiary-${index}-relation`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
              Relation <span className="text-red-500">*</span>
            </Label>
            <Input
              id={`beneficiary-${index}-relation`}
              {...register(`step6.beneficiaries.${index}.relation`)}
              placeholder="e.g., Spouse, Son, Daughter"
              className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
            />
            {errors.step6?.beneficiaries?.[index]?.relation && (
              <p className="text-sm text-red-500 mt-1">{errors.step6.beneficiaries[index]?.relation?.message}</p>
            )}
          </div>
        </div>

        {/* PAN and Aadhaar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor={`beneficiary-${index}-pan`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
              PAN (Optional)
            </Label>
            <Input
              id={`beneficiary-${index}-pan`}
              {...register(`step6.beneficiaries.${index}.pan`)}
              placeholder="ABCDE1234F"
              maxLength={10}
              className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8] uppercase"
              onChange={(e) => {
                const cleaned = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
                setValue(`step6.beneficiaries.${index}.pan`, cleaned);
              }}
            />
            {errors.step6?.beneficiaries?.[index]?.pan && (
              <p className="text-sm text-red-500 mt-1">{errors.step6.beneficiaries[index]?.pan?.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor={`beneficiary-${index}-aadhaar`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
              Aadhaar (Optional)
            </Label>
            <Input
              id={`beneficiary-${index}-aadhaar`}
              {...register(`step6.beneficiaries.${index}.aadhaar`)}
              placeholder="12-digit Aadhaar"
              maxLength={12}
              inputMode="numeric"
              className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 12);
                setValue(`step6.beneficiaries.${index}.aadhaar`, digits);
              }}
            />
            {errors.step6?.beneficiaries?.[index]?.aadhaar && (
              <p className="text-sm text-red-500 mt-1">{errors.step6.beneficiaries[index]?.aadhaar?.message}</p>
            )}
          </div>
        </div>

        {/* Date of Birth and Age */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor={`beneficiary-${index}-dob`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              id={`beneficiary-${index}-dob`}
              {...register(`step6.beneficiaries.${index}.dateOfBirth`, {
                onChange: (e) => {
                  const age = calculateAge(e.target.value);
                  setValue(`step6.beneficiaries.${index}.age`, age);
                },
              })}
              className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
            />
            {errors.step6?.beneficiaries?.[index]?.dateOfBirth && (
              <p className="text-sm text-red-500 mt-1">{errors.step6.beneficiaries[index]?.dateOfBirth?.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor={`beneficiary-${index}-age`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
              Age
            </Label>
            <Input
              id={`beneficiary-${index}-age`}
              {...register(`step6.beneficiaries.${index}.age`)}
              readOnly
              className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg bg-gray-50 focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
            />
          </div>
        </div>

        {/* Guardian Information (conditional) */}
        {isMinor && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-lg font-medium text-yellow-800 mb-4">Guardian Information (Required for Minor)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor={`beneficiary-${index}-guardian-name`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                  Guardian Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`beneficiary-${index}-guardian-name`}
                  {...register(`step6.beneficiaries.${index}.guardianName`)}
                  placeholder="Enter guardian's name"
                  className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                />
                {errors.step6?.beneficiaries?.[index]?.guardianName && (
                  <p className="text-sm text-red-500 mt-1">{errors.step6.beneficiaries[index]?.guardianName?.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor={`beneficiary-${index}-guardian-relation`} className="block text-sm font-medium text-[#5E4B8C] mb-1">
                  Relation to Beneficiary <span className="text-red-500">*</span>
                </Label>
                <Input
                  id={`beneficiary-${index}-guardian-relation`}
                  {...register(`step6.beneficiaries.${index}.guardianRelation`)}
                  placeholder="e.g., Father, Mother"
                  className="w-full px-4 py-3 border border-[#8B7BB8] rounded-lg focus:ring-[#8B7BB8] focus:border-[#8B7BB8]"
                />
                {errors.step6?.beneficiaries?.[index]?.guardianRelation && (
                  <p className="text-sm text-red-500 mt-1">{errors.step6.beneficiaries[index]?.guardianRelation?.message}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
