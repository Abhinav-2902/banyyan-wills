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
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Loan Repayment</h2>
              <p className="text-rose-100 text-sm font-medium mt-1">Address your liabilities</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8 p-4 border border-rose-100 bg-rose-50/50 backdrop-blur-sm rounded-xl">
            <p className="text-sm text-gray-700 font-medium leading-relaxed">
              Add details of loans and outstanding debts you wish to account for. This helps ensure liabilities are addressed properly in your will.
            </p>
          </div>

          {fields.length === 0 ? (
            <div className="text-center py-12 bg-rose-50/10 rounded-2xl border-2 border-dashed border-rose-100">
              <div className="p-4 bg-white rounded-2xl shadow-sm w-fit mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-rose-400" />
              </div>
              <p className="text-gray-500 font-medium mb-6">No loan repayment accounts added yet</p>
              <Button
                type="button"
                onClick={addAccount}
                className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] text-white rounded-xl shadow-md shadow-rose-100 hover:from-[#FF5555] hover:to-[#FF7676] transition-all font-bold tracking-tight active:scale-[0.98]"
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
                  <div key={field.id} className="relative group p-8 rounded-2xl transition-all border-2 border-gray-100 hover:border-rose-100 hover:shadow-xl hover:shadow-gray-100 mb-8 last:mb-0">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-rose-500 rounded-xl">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Account {index + 1}</h3>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeAccount(index)}
                        className="rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors font-bold text-xs uppercase tracking-wider"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    </div>

                    {/* Account Source Selector */}
                    <div className="mb-8">
                      <Label htmlFor={`account-source-${index}`} className="block text-sm font-bold text-gray-700 mb-2">
                        Select Account Source
                      </Label>
                      <div className="relative">
                        <select
                          id={`account-source-${index}`}
                          value={fromAssets ? assetBankAccounts.findIndex((b) => 
                            b.accountNumber === account.accountNumber && b.bankName === account.bankName
                          ) : 'new'}
                          onChange={(e) => handleAccountSelect(index, e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] appearance-none transition-all cursor-pointer font-medium text-gray-700"
                        >
                          {assetBankAccounts.map((b, i) => (
                            <option key={`${b.bankName}-${i}`} value={i.toString()}>
                              {b.bankName} ({maskLast4(b.accountNumber)})
                            </option>
                          ))}
                          <option value="new">Add New Bank Account</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {fromAssets ? (
                      <div className="bg-rose-50/30 rounded-2xl p-6 border-2 border-rose-100 border-dashed animate-in fade-in zoom-in-95 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">Bank Name</span>
                            <span className="text-lg font-bold text-gray-900">{account.bankName}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">Account Number</span>
                            <span className="text-lg font-bold text-gray-900 underline decoration-rose-200 decoration-2 underline-offset-4">{maskLast4(account.accountNumber) || '—'}</span>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">Account Type</span>
                            <span className="text-lg font-bold text-gray-900">{account.accountType || '—'}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="space-y-2">
                          <Label htmlFor={`bankName-${index}`} className="block text-sm font-bold text-gray-700">
                            Bank Name *
                          </Label>
                          <Input
                            id={`bankName-${index}`}
                            {...register(`step11.accounts.${index}.bankName`)}
                            placeholder="Enter bank name"
                            className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                          />
                          {errors.step11?.accounts?.[index]?.bankName && (
                            <p className="text-sm text-rose-500 mt-1 font-medium">
                              {errors.step11.accounts[index]?.bankName?.message}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`accountNumber-${index}`} className="block text-sm font-bold text-gray-700">
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
                            className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`accountType-${index}`} className="block text-sm font-bold text-gray-700">
                            Account Type
                          </Label>
                          <Input
                            id={`accountType-${index}`}
                            {...register(`step11.accounts.${index}.accountType`)}
                            placeholder="e.g., Savings, Current"
                            className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
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
                className="w-full py-6 mt-8 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold uppercase tracking-widest text-xs"
              >
                <Plus className="h-5 w-5 mr-3" />
                Add Another Account
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
