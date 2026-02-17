"use client";

import { useFormContext, useFieldArray } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MessageSquare, Plus, Trash2, Heart } from "lucide-react";

const funeralOptions = [
  { value: '', label: 'No preference' },
  { value: 'cremation', label: 'Cremation' },
  { value: 'burial', label: 'Burial' },
  { value: 'science', label: 'Donate body to science' },
];

export function Step10SpecialWishes() {
  const {
    register,
    control,
  } = useFormContext<CompleteWillFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "step10.messages",
  });

  const addMessage = () => {
    append({
      name: "",
      relation: "",
      message: "",
    });
  };

  const removeMessage = (index: number) => {
    if (fields.length > 0) {
      remove(index);
    }
  };

  return (
    <div className="space-y-6">
      {/* Funeral Options */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Funeral Options</h2>
              <p className="text-rose-100 text-sm font-medium mt-1">Specify your final wishes</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Choose what happens to your body (disposition): cremation, burial, or donation to science.
          </p>

          <div>
            <Label htmlFor="funeral-wish" className="block text-sm font-bold text-gray-700 mb-2">
              Funeral Preference
            </Label>
            <div className="relative">
              <select
                id="funeral-wish"
                {...register("step10.funeralWish")}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] appearance-none transition-all cursor-pointer font-medium text-gray-700"
              >
                {funeralOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Messages to Family */}
    <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Messages to Family</h2>
              <p className="text-rose-100 text-sm font-medium mt-1">Leave heartfelt words for loved ones</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Leave personal messages for your loved ones. These heartfelt words will be included in your will.
          </p>

          {fields.length === 0 ? (
            <div className="text-center py-12 bg-rose-50/10 rounded-2xl border-2 border-dashed border-rose-100">
              <div className="p-4 bg-white rounded-2xl shadow-sm w-fit mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-rose-400" />
              </div>
              <p className="text-gray-500 font-medium mb-6">No messages added yet</p>
              <Button
                type="button"
                onClick={addMessage}
                className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] text-white rounded-xl shadow-md shadow-rose-100 hover:from-[#FF5555] hover:to-[#FF7676] transition-all font-bold tracking-tight active:scale-[0.98]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Message
              </Button>
            </div>
          ) : (
            <>
              {fields.map((field, index) => (
                <div key={field.id} className="relative group p-8 rounded-2xl transition-all border-2 border-gray-100 hover:border-rose-100 hover:shadow-xl hover:shadow-gray-100 mb-8 last:mb-0">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-rose-500 rounded-xl">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 tracking-tight">Message {index + 1}</h3>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeMessage(index)}
                      className="rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors font-bold text-xs uppercase tracking-wider"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor={`message-${index}-name`} className="block text-sm font-bold text-gray-700">
                        Recipient Name *
                      </Label>
                      <Input
                        id={`message-${index}-name`}
                        {...register(`step10.messages.${index}.name`)}
                        placeholder="Enter recipient's name"
                        className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`message-${index}-relation`} className="block text-sm font-bold text-gray-700">
                        Relation *
                      </Label>
                      <Input
                        id={`message-${index}-relation`}
                        {...register(`step10.messages.${index}.relation`)}
                        placeholder="e.g., Son, Daughter, Friend"
                        className="w-full focus:ring-[#FF6B6B] focus:border-[#FF6B6B]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`message-${index}-message`} className="block text-sm font-bold text-gray-700">
                      Deeply Personal Message *
                    </Label>
                    <textarea
                      id={`message-${index}-message`}
                      {...register(`step10.messages.${index}.message`)}
                      placeholder="Share your heartfelt thoughts, advice, or wishes..."
                      rows={6}
                      className="w-full border border-gray-300 rounded-xl px-4 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-all resize-none font-medium leading-relaxed"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={addMessage}
                variant="outline"
                className="w-full py-6 mt-8 border-2 border-dashed border-gray-200 rounded-2xl text-gray-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold uppercase tracking-widest text-xs"
              >
                <Plus className="h-5 w-5 mr-3" />
                Add Another Message
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Other Arrangements */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Other Arrangements</h2>
              <p className="text-rose-100 text-sm font-medium mt-1">Specify additional wishes</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Include any other special arrangements, wishes, or instructions you&apos;d like to specify.
          </p>

          <div className="space-y-4">
            <Label htmlFor="other-arrangements" className="block text-sm font-bold text-gray-700">
              Special Instructions or Arrangements
            </Label>
            <textarea
              id="other-arrangements"
              {...register("step10.otherArrangements")}
              placeholder="Enter any other special arrangements or wishes you'd like to include..."
              rows={8}
              className="w-full border border-gray-300 rounded-xl px-4 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF6B6B] focus:border-[#FF6B6B] transition-all resize-none font-medium leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
