"use client";

// import { useFormContext } from "react-hook-form";
// import { CompleteWillFormData } from "@/lib/validations/will";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ImmovablePropertySection } from "./assets/immovable-property-section";
import { BankAccountSection } from "./assets/bank-account-section";
import { InvestmentSection } from "./assets/investment-section";
import { VehicleSection } from "./assets/vehicle-section";
import { JewelrySection } from "./assets/jewelry-section";

export function Step3AssetDetails() {
  // const { watch } = useFormContext<CompleteWillFormData>(); // Not used yet

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        {/* Helper Text */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-800 dark:text-blue-200 text-sm">
          <p className="font-medium">
             Please list your assets. You only need to add assets you wish to specifically bequeath or document. 
             If you leave this blank, your assets will be distributed according to the residuary clause (which covers &apos;everything else&apos;).
          </p>
        </div>

        {/* 1. Immovable Property */}
        <Card>
           <CardHeader>
            <CardTitle>Immovable Property</CardTitle>
            <CardDescription>Real estate such as houses, apartments, and land.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImmovablePropertySection />
          </CardContent>
        </Card>

        {/* 2. Bank Accounts */}
        <Card>
          <CardHeader>
             <CardTitle>Bank Accounts</CardTitle>
             <CardDescription>Savings, Current, FD, RD accounts held in your name.</CardDescription>
          </CardHeader>
          <CardContent>
             <BankAccountSection />
          </CardContent>
        </Card>

        {/* 3. Investments */}
        <Card>
          <CardHeader>
             <CardTitle>Investments</CardTitle>
             <CardDescription>Shares, Mutual Funds, Bonds, Insurance Policies, etc.</CardDescription>
          </CardHeader>
          <CardContent>
             <InvestmentSection />
          </CardContent>
        </Card>

        {/* 4. Vehicles */}
        <Card>
          <CardHeader>
             <CardTitle>Vehicles</CardTitle>
             <CardDescription>Cars, two-wheelers, or other vehicles.</CardDescription>
          </CardHeader>
          <CardContent>
             <VehicleSection />
          </CardContent>
        </Card>

        {/* 5. Jewelry & Valuables */}
        <Card>
          <CardHeader>
             <CardTitle>Jewelry & Valuables</CardTitle>
             <CardDescription>Precious metals, stones, antiques, etc.</CardDescription>
          </CardHeader>
          <CardContent>
             <JewelrySection />
          </CardContent>
        </Card>
        
        {/* ... More placeholders can be added or we implement them one by one */}
      </div>
    </div>
  );
}
