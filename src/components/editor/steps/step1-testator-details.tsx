"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  priorityNationalities,
  getOtherNationalities,
} from "@/lib/constants/nationality-constants";

export function Step1TestatorDetails() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<CompleteWillFormData>();

  const dob = watch("step1.dateOfBirth");
  const maritalStatus = watch("step1.maritalStatus");
  const otherNationalities = getOtherNationalities();

  // Auto-calculate age when DOB changes
  useEffect(() => {
    if (dob) {
      const birthDate = new Date(dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      setValue("step1.age", age, { shouldValidate: true });
    }
  }, [dob, setValue]);

  const age = watch("step1.age");

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 text-sm">
        <p className="font-medium">Please enter your details exactly as they appear on your government ID (Aadhaar/PAN).</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="fullName"
              placeholder="e.g. Rajesh Kumar Sharma"
              {...register("step1.fullName")}
            />
            {errors.step1?.fullName && (
              <p className="text-sm text-red-500">{errors.step1.fullName.message}</p>
            )}
          </div>

          {/* Father's/Mother's Name */}
          <div className="space-y-2">
            <Label htmlFor="fatherMotherName">Father&apos;s/Mother&apos;s Name <span className="text-red-500">*</span></Label>
            <Input
              id="fatherMotherName"
              placeholder="Parent's name"
              {...register("step1.fatherMotherName")}
            />
            {errors.step1?.fatherMotherName && (
              <p className="text-sm text-red-500">{errors.step1.fatherMotherName.message}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth <span className="text-red-500">*</span></Label>
            <Input
              id="dateOfBirth"
              type="date"
              {...register("step1.dateOfBirth")}
            />
            {errors.step1?.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.step1.dateOfBirth.message}</p>
            )}
          </div>

          {/* Age (Read Only) */}
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              readOnly
              className="bg-gray-100"
              {...register("step1.age", { valueAsNumber: true })}
            />
            {errors.step1?.age && (
              <p className="text-sm text-red-500">{errors.step1.age.message}</p>
            )}
            {age !== undefined && age < 18 && (
              <p className="text-sm text-red-500">You must be at least 18 years old to make a will.</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label>Gender <span className="text-red-500">*</span></Label>
            <Select
              onValueChange={(value) => setValue("step1.gender", value as "Male" | "Female" | "Other", { shouldValidate: true })}
              defaultValue={watch("step1.gender")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.step1?.gender && (
              <p className="text-sm text-red-500">{errors.step1.gender.message}</p>
            )}
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <Label>Marital Status <span className="text-red-500">*</span></Label>
            <Select
              onValueChange={(value) => setValue("step1.maritalStatus", value as "Single" | "Married" | "Divorced" | "Widowed" | "Separated", { shouldValidate: true })}
              defaultValue={watch("step1.maritalStatus")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Married">Married</SelectItem>
                <SelectItem value="Divorced">Divorced</SelectItem>
                <SelectItem value="Widowed">Widowed</SelectItem>
                <SelectItem value="Separated">Separated</SelectItem>
              </SelectContent>
            </Select>
            {errors.step1?.maritalStatus && (
              <p className="text-sm text-red-500">{errors.step1.maritalStatus.message}</p>
            )}
          </div>

          {/* Nationality */}
          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality (Optional)</Label>
            <Select
              onValueChange={(value) => setValue("step1.nationality", value, { shouldValidate: true })}
              defaultValue={watch("step1.nationality")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select nationality" />
              </SelectTrigger>
            <SelectContent>
                <SelectItem value="in-priority" disabled className="font-semibold text-gray-500 text-xs uppercase tracking-wider pl-2 py-1 bg-gray-50">
                  Priority
                </SelectItem>
                {priorityNationalities.map((nationality) => (
                  <SelectItem key={nationality} value={nationality}>
                    {nationality}
                  </SelectItem>
                ))}
                <SelectItem value="sep-line" disabled className="h-px bg-gray-200 my-1 p-0 focus:bg-gray-200" />
                <SelectItem value="in-all" disabled className="font-semibold text-gray-500 text-xs uppercase tracking-wider pl-2 py-1 bg-gray-50">
                  All Nationalities
                </SelectItem>
                {otherNationalities.map((nationality) => (
                  <SelectItem key={nationality} value={nationality}>
                    {nationality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Religion (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="religion">Religion (Optional)</Label>
            <Input
              id="religion"
              placeholder="e.g. Hindu, Muslim, Christian, Sikh"
              {...register("step1.religion")}
            />
          </div>

          {/* Occupation (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="occupation">Occupation (Optional)</Label>
            <Input
              id="occupation"
              placeholder="Current occupation"
              {...register("step1.occupation")}
            />
          </div>

          {/* PAN Number */}
          <div className="space-y-2">
            <Label htmlFor="panNumber">PAN Number (Optional)</Label>
            <Input
              id="panNumber"
              placeholder="e.g. ABCDE1234F"
              className="uppercase"
              maxLength={10}
              {...register("step1.panNumber")}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                register("step1.panNumber").onChange(e);
              }}
            />
            {errors.step1?.panNumber && (
              <p className="text-sm text-red-500">{errors.step1.panNumber.message}</p>
            )}
          </div>

          {/* Aadhaar Number */}
          <div className="space-y-2">
            <Label htmlFor="aadhaarNumber">Aadhaar Number (Optional)</Label>
            <Input
              id="aadhaarNumber"
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              {...register("step1.aadhaarNumber")}
            />
            {errors.step1?.aadhaarNumber && (
              <p className="text-sm text-red-500">{errors.step1.aadhaarNumber.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parents Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Father's Name */}
          <div className="space-y-2">
            <Label htmlFor="fatherName">Father&apos;s Name <span className="text-red-500">*</span></Label>
            <Input
              id="fatherName"
              placeholder="Enter father's name"
              {...register("step1.fatherName")}
            />
            {errors.step1?.fatherName && (
              <p className="text-sm text-red-500">{errors.step1.fatherName.message}</p>
            )}
          </div>

          {/* Mother's Name */}
          <div className="space-y-2">
            <Label htmlFor="motherName">Mother&apos;s Name <span className="text-red-500">*</span></Label>
            <Input
              id="motherName"
              placeholder="Enter mother's name"
              {...register("step1.motherName")}
            />
            {errors.step1?.motherName && (
              <p className="text-sm text-red-500">{errors.step1.motherName.message}</p>
            )}
          </div>

          {/* Father's Aadhaar */}
          <div className="space-y-2">
            <Label htmlFor="fatherAadhaar">Father&apos;s Aadhaar Number (Optional)</Label>
            <Input
              id="fatherAadhaar"
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              {...register("step1.fatherAadhaar")}
            />
            {errors.step1?.fatherAadhaar && (
              <p className="text-sm text-red-500">{errors.step1.fatherAadhaar.message}</p>
            )}
          </div>

          {/* Mother's Aadhaar */}
          <div className="space-y-2">
            <Label htmlFor="motherAadhaar">Mother&apos;s Aadhaar Number (Optional)</Label>
            <Input
              id="motherAadhaar"
              placeholder="12-digit Aadhaar number"
              maxLength={12}
              {...register("step1.motherAadhaar")}
            />
            {errors.step1?.motherAadhaar && (
              <p className="text-sm text-red-500">{errors.step1.motherAadhaar.message}</p>
            )}
          </div>

          {/* Father's PAN */}
          <div className="space-y-2">
            <Label htmlFor="fatherPan">Father&apos;s PAN Number (Optional)</Label>
            <Input
              id="fatherPan"
              placeholder="e.g. ABCDE1234F"
              className="uppercase"
              maxLength={10}
              {...register("step1.fatherPan")}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                register("step1.fatherPan").onChange(e);
              }}
            />
            {errors.step1?.fatherPan && (
              <p className="text-sm text-red-500">{errors.step1.fatherPan.message}</p>
            )}
          </div>

          {/* Mother's PAN */}
          <div className="space-y-2">
            <Label htmlFor="motherPan">Mother&apos;s PAN Number (Optional)</Label>
            <Input
              id="motherPan"
              placeholder="e.g. ABCDE1234F"
              className="uppercase"
              maxLength={10}
              {...register("step1.motherPan")}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
                register("step1.motherPan").onChange(e);
              }}
            />
            {errors.step1?.motherPan && (
              <p className="text-sm text-red-500">{errors.step1.motherPan.message}</p>
            )}
          </div>

          {/* Father's DOB */}
          <div className="space-y-2">
            <Label htmlFor="fatherDateOfBirth">Father&apos;s Date of Birth (Optional)</Label>
            <Input
              id="fatherDateOfBirth"
              type="date"
              {...register("step1.fatherDateOfBirth")}
            />
          </div>

          {/* Mother's DOB */}
          <div className="space-y-2">
            <Label htmlFor="motherDateOfBirth">Mother&apos;s Date of Birth (Optional)</Label>
            <Input
              id="motherDateOfBirth"
              type="date"
              {...register("step1.motherDateOfBirth")}
            />
          </div>
        </CardContent>
      </Card>

      {/* Spouse Information - Conditional */}
      {maritalStatus === "Married" && (
        <Card>
          <CardHeader>
            <CardTitle>Spouse Information</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spouse Name */}
            <div className="space-y-2">
              <Label htmlFor="spouseName">Spouse&apos;s Name <span className="text-red-500">*</span></Label>
              <Input
                id="spouseName"
                placeholder="Enter spouse's full name"
                {...register("step1.spouseDetails.fullName")}
              />
              {errors.step1?.spouseDetails?.fullName && (
                <p className="text-sm text-red-500">{errors.step1.spouseDetails.fullName.message}</p>
              )}
            </div>

            {/* Spouse DOB */}
            <div className="space-y-2">
              <Label htmlFor="spouseDateOfBirth">Spouse&apos;s Date of Birth <span className="text-red-500">*</span></Label>
              <Input
                id="spouseDateOfBirth"
                type="date"
                {...register("step1.spouseDetails.dateOfBirth")}
              />
              {errors.step1?.spouseDetails?.dateOfBirth && (
                <p className="text-sm text-red-500">{errors.step1.spouseDetails.dateOfBirth.message}</p>
              )}
            </div>

            {/* Spouse Aadhaar */}
            <div className="space-y-2">
              <Label htmlFor="spouseAadhaar">Spouse&apos;s Aadhaar Number (Optional)</Label>
              <Input
                id="spouseAadhaar"
                placeholder="12-digit Aadhaar number"
                maxLength={12}
                {...register("step1.spouseDetails.aadhaarNumber")}
              />
              {errors.step1?.spouseDetails?.aadhaarNumber && (
                <p className="text-sm text-red-500">{errors.step1.spouseDetails.aadhaarNumber.message}</p>
              )}
            </div>

            {/* Spouse PAN */}
            <div className="space-y-2">
              <Label htmlFor="spousePan">Spouse&apos;s PAN Number (Optional)</Label>
              <Input
                id="spousePan"
                placeholder="e.g. ABCDE1234F"
                className="uppercase"
                maxLength={10}
                {...register("step1.spouseDetails.panNumber")}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  register("step1.spouseDetails.panNumber").onChange(e);
                }}
              />
              {errors.step1?.spouseDetails?.panNumber && (
                <p className="text-sm text-red-500">{errors.step1.spouseDetails.panNumber.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mobile Number */}
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number (10 digits) <span className="text-red-500">*</span></Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <Input
                id="mobileNumber"
                placeholder="9876543210"
                maxLength={10}
                className="rounded-l-none"
                {...register("step1.contactInfo.mobileNumber")}
              />
            </div>
            {errors.step1?.contactInfo?.mobileNumber && (
              <p className="text-sm text-red-500">{errors.step1.contactInfo.mobileNumber.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label htmlFor="emailAddress">Email Address <span className="text-red-500">*</span></Label>
            <Input
              id="emailAddress"
              type="email"
              placeholder="you@example.com"
              {...register("step1.contactInfo.emailAddress")}
            />
            {errors.step1?.contactInfo?.emailAddress && (
              <p className="text-sm text-red-500">{errors.step1.contactInfo.emailAddress.message}</p>
            )}
          </div>
          
           {/* Alternate Mobile (Optional) */}
           <div className="space-y-2">
            <Label htmlFor="alternateMobileNumber">Alternate Mobile (Optional)</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                +91
              </span>
              <Input
                id="alternateMobileNumber"
                placeholder="9876543210"
                maxLength={10}
                className="rounded-l-none"
                {...register("step1.contactInfo.alternateMobileNumber")}
              />
            </div>
             {errors.step1?.contactInfo?.alternateMobileNumber && (
              <p className="text-sm text-red-500">{errors.step1.contactInfo.alternateMobileNumber.message}</p>
            )}
          </div>

           {/* Alternate Email (Optional) */}
           <div className="space-y-2">
            <Label htmlFor="alternateEmailAddress">Alternate Email (Optional)</Label>
            <Input
              id="alternateEmailAddress"
              type="email"
              placeholder="alt@example.com"
              {...register("step1.contactInfo.alternateEmailAddress")}
            />
             {errors.step1?.contactInfo?.alternateEmailAddress && (
              <p className="text-sm text-red-500">{errors.step1.contactInfo.alternateEmailAddress.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Residential Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Address Line 1 */}
          <div className="space-y-2">
            <Label htmlFor="addressLine1">Address Line 1 <span className="text-red-500">*</span></Label>
            <Input
              id="addressLine1"
              placeholder="House No., Building Name, Street"
              {...register("step1.residentialAddress.addressLine1")}
            />
            {errors.step1?.residentialAddress?.addressLine1 && (
              <p className="text-sm text-red-500">{errors.step1.residentialAddress.addressLine1.message}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div className="space-y-2">
            <Label htmlFor="addressLine2">Address Line 2 (Optional)</Label>
            <Input
              id="addressLine2"
              placeholder="Area, Landmark"
              {...register("step1.residentialAddress.addressLine2")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
              <Input
                id="city"
                placeholder="City"
                {...register("step1.residentialAddress.city")}
              />
              {errors.step1?.residentialAddress?.city && (
                <p className="text-sm text-red-500">{errors.step1.residentialAddress.city.message}</p>
              )}
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
              <Input
                id="state"
                placeholder="State"
                {...register("step1.residentialAddress.state")}
              />
              {errors.step1?.residentialAddress?.state && (
                <p className="text-sm text-red-500">{errors.step1.residentialAddress.state.message}</p>
              )}
            </div>

            {/* PIN Code */}
            <div className="space-y-2">
              <Label htmlFor="pinCode">PIN Code <span className="text-red-500">*</span></Label>
              <Input
                id="pinCode"
                placeholder="110001"
                maxLength={6}
                {...register("step1.residentialAddress.pinCode")}
              />
              {errors.step1?.residentialAddress?.pinCode && (
                <p className="text-sm text-red-500">{errors.step1.residentialAddress.pinCode.message}</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
              <Input
                id="country"
                defaultValue="India"
                 {...register("step1.residentialAddress.country")}
              />
            </div>
            
             {/* Years at Address */}
            <div className="space-y-2">
               <Label htmlFor="yearsAtAddress">Years at this Address (Optional)</Label>
              <Input
                id="yearsAtAddress"
                type="number"
                 {...register("step1.residentialAddress.yearsAtAddress", { 
                   setValueAs: (v) => {
                     if (v === "" || v === null || v === undefined) return undefined;
                     const num = parseInt(v, 10);
                     return isNaN(num) ? undefined : num;
                   },
                 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
