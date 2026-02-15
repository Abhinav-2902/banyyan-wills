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
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] px-6 py-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Funeral Options</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Choose what happens to your body (disposition): cremation, burial, or donation to science.
          </p>

          <div>
            <Label htmlFor="funeral-wish" className="block text-sm font-medium text-gray-700 mb-2">
              Funeral Preference
            </Label>
            <select
              id="funeral-wish"
              {...register("step10.funeralWish")}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              {funeralOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages to Family */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] px-6 py-4">
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Messages to Family</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Leave personal messages for your loved ones. These heartfelt words will be included in your will.
          </p>

          {fields.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No messages added yet</p>
              <Button
                type="button"
                onClick={addMessage}
                className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] hover:from-[#7A6BAD] hover:to-[#381F64]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Message
              </Button>
            </div>
          ) : (
            <>
              {fields.map((field, index) => (
                <div key={field.id} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Message {index + 1}</h3>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeMessage(index)}
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor={`message-${index}-name`} className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </Label>
                      <Input
                        id={`message-${index}-name`}
                        {...register(`step10.messages.${index}.name`)}
                        placeholder="Recipient's name"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`message-${index}-relation`} className="block text-sm font-medium text-gray-700 mb-1">
                        Relation
                      </Label>
                      <Input
                        id={`message-${index}-relation`}
                        {...register(`step10.messages.${index}.relation`)}
                        placeholder="e.g., Son, Daughter, Friend"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`message-${index}-message`} className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </Label>
                    <textarea
                      id={`message-${index}-message`}
                      {...register(`step10.messages.${index}.message`)}
                      placeholder="Write your heartfelt message here..."
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                onClick={addMessage}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Another Message
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Other Arrangements */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-[#8B7BB8] to-[#432371] px-6 py-4">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">Other Arrangements</h2>
          </div>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Include any other special arrangements, wishes, or instructions you&apos;d like to specify.
          </p>

          <div>
            <Label htmlFor="other-arrangements" className="block text-sm font-medium text-gray-700 mb-2">
              Special Arrangements
            </Label>
            <textarea
              id="other-arrangements"
              {...register("step10.otherArrangements")}
              placeholder="Enter any other special arrangements or wishes here..."
              rows={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
