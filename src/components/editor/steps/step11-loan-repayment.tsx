"use client";

import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Asset, BankAccountDetails, LoanAccount } from "@/types/will";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { useCallback } from "react";

export function Step11LoanRepayment() {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step11.accounts",
  });

  // Watch assets from Step 8
  const assets = (useWatch({ name: "step8.assets" }) as Asset[]) || [];
  
  // Filter bank accounts from assets
  const assetBankAccounts: BankAccountDetails[] = assets
    .filter((asset) => asset.type === 'Bank Account')
    .map((asset) => asset.details);

  const addAccount = () => {
    append({
      bankName: "",
      accountNumber: "",
      accountType: "",
      fromAssets: false,
    });
  };

  const removeAccount = (index: number) => {
    if (fields.length > 0) {
      remove(index);
    }
  };

  // Safely display only the last 4 digits of an account number
  const maskLast4 = useCallback((val: string) => {
    if (!val) return '';
    const digits = String(val).replace(/\D/g, '');
    const last4 = digits.slice(-4);
    return last4 ? `•••• ${last4}` : '';
  }, []);

  const handleAccountSelect = (index: number, value: string) => {
    if (value === 'new') {
      setValue(`step11.accounts.${index}.bankName`, '');
      setValue(`step11.accounts.${index}.accountNumber`, '');
      setValue(`step11.accounts.${index}.accountType`, '');
      setValue(`step11.accounts.${index}.fromAssets`, false);
    } else {
      const selectedIndex = parseInt(value);
      const selected = assetBankAccounts[selectedIndex];
      if (selected) {
        setValue(`step11.accounts.${index}.bankName`, selected.bankName || '');
        setValue(`step11.accounts.${index}.accountNumber`, selected.accountNumber || '');
        setValue(`step11.accounts.${index}.accountType`, selected.accountType || '');
        setValue(`step11.accounts.${index}.fromAssets`, true);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] px-6 py-4">
          <div className="flex items-center space-x-3">
            <CreditCard className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Loan Repayment Accounts</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 border border-purple-200 bg-purple-50/80 backdrop-blur-sm rounded-lg">
            <p className="text-sm text-gray-800">
              Add details of loans and outstanding debts you wish to account for. This helps ensure liabilities are addressed properly in your will.
            </p>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No loan repayment accounts added yet</p>
              <Button
                type="button"
                onClick={addAccount}
                className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] hover:from-[#7A6BAD] hover:to-[#381F64]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Account
              </Button>
            </div>
          ) : (
            <>
              {fields.map((field, index) => {
                const account = field as LoanAccount;
                const fromAssets = account.fromAssets || false;

                return (
                  <div key={field.id} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Account {index + 1}</h3>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeAccount(index)}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>

                    {/* Account Source Selector */}
                    <div className="mb-4">
                      <Label htmlFor={`account-source-${index}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Select Account Source
                      </Label>
                      <select
                        id={`account-source-${index}`}
                        value={fromAssets ? assetBankAccounts.findIndex((b) => 
                          b.accountNumber === account.accountNumber && b.bankName === account.bankName
                        ) : 'new'}
                        onChange={(e) => handleAccountSelect(index, e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      >
                        {assetBankAccounts.map((b, i) => (
                          <option key={`${b.bankName}-${i}`} value={i.toString()}>
                            {b.bankName} ({maskLast4(b.accountNumber)})
                          </option>
                        ))}
                        <option value="new">Add New Bank Account</option>
                      </select>
                    </div>

                    {fromAssets ? (
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-medium text-gray-700">Bank Name:</span>
                            <span className="ml-2 text-gray-600">{account.bankName}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Account Number:</span>
                            <span className="ml-2 text-gray-600">{maskLast4(account.accountNumber) || '—'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Account Type:</span>
                            <span className="ml-2 text-gray-600">{account.accountType || '—'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`bankName-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Bank Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id={`bankName-${index}`}
                            {...register(`step11.accounts.${index}.bankName`)}
                            placeholder="Enter bank name"
                            className="w-full"
                          />
                          {errors.step11?.accounts?.[index]?.bankName && (
                            <p className="text-sm text-red-500 mt-1">
                              {errors.step11.accounts[index]?.bankName?.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor={`accountNumber-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Account Number (Last 4 digits)
                          </Label>
                          <Input
                            id={`accountNumber-${index}`}
                            {...register(`step11.accounts.${index}.accountNumber`)}
                            placeholder="Last 4 digits only"
                            maxLength={4}
                            inputMode="numeric"
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                              setValue(`step11.accounts.${index}.accountNumber`, val);
                            }}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`accountType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Account Type
                          </Label>
                          <Input
                            id={`accountType-${index}`}
                            {...register(`step11.accounts.${index}.accountType`)}
                            placeholder="e.g., Savings, Current"
                            className="w-full"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              <Button
                type="button"
                onClick={addAccount}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Another Account
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
