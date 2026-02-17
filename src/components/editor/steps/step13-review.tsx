"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CompleteWillFormData, AssetImage } from "@/lib/validations/will";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { previewWillPDFAction } from "@/server/actions/preview-will-pdf";
import { useToast } from "@/hooks/use-toast";
import { autoSaveWillAction } from "@/server/actions/will";

// Section component for collapsible sections
function Section({ 
  title, 
  children, 
  isOpen, 
  onToggle 
}: { 
  title: string; 
  children: React.ReactNode; 
  isOpen: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className={`bg-white rounded-2xl transition-all border-2 ${
      isOpen ? 'border-[#FF6B6B] shadow-xl shadow-rose-100/50' : 'border-gray-100 hover:border-rose-100 hover:shadow-lg'
    } overflow-hidden`}>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-6 transition-colors ${
          isOpen ? 'bg-rose-50/30' : 'hover:bg-rose-50/10'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg transition-colors ${isOpen ? 'bg-[#FF6B6B] text-white' : 'bg-gray-100 text-gray-500'}`}>
            <FileText className="h-4 w-4" />
          </div>
          <h3 className={`text-lg font-bold transition-colors ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-[#FF6B6B]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="p-8 pt-0 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="h-px bg-gray-100 mb-6" />
          {children}
        </div>
      )}
    </div>
  );
}

// Key-value display component
function KeyValue({ label, value }: { label: string; value: string | number | undefined | null }) {
  return (
    <div className="grid grid-cols-3 gap-4 py-2 border-b border-gray-100 last:border-0">
      <dt className="font-medium text-gray-600">{label}</dt>
      <dd className="col-span-2 text-gray-900">{value || <span className="text-gray-400">Not specified</span>}</dd>
    </div>
  );
}

export function Step13Review({ willId }: { willId?: string }) {
  const { watch } = useFormContext<CompleteWillFormData>();
  const formData = watch();
  const { toast } = useToast();
  
  // State for section toggles
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);

  const toggleSection = (index: number) => {
    setOpenSections(prev => ({ ...prev, [index]: !prev[index] }));
  };

  // DEBUG: Check if images exist in data
  const assetsWithImages = formData.step8?.assets?.filter(a => a.details?.images && a.details.images.length > 0) || [];
  console.log("Assets with images:", assetsWithImages);


  const expandAll = () => {
    const allOpen: Record<number, boolean> = {};
    for (let i = 0; i < 13; i++) {
      allOpen[i] = true;
    }
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  // Helper function to convert base64 to blob
  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };


  const handlePreviewPDF = async () => {
    setIsGeneratingPreview(true);
    try {
      if (!willId) {
        toast({
          title: "Error",
          description: "Will ID not found. Please save your will first.",
          variant: "destructive",
        });
        return;
      }

      // Auto-save before preview to ensure DB has latest data (including images)
      const saveResult = await autoSaveWillAction(formData, willId);
      if (!saveResult.success) {
        console.warn("Auto-save before preview failed:", saveResult.error);
        // We continue anyway, as preview might still work with old data, or show validation errors
      }

      // Generate PDF using the dedicated preview action
      const result = await previewWillPDFAction(willId);

      if (!result.success) {
        toast({
          title: "Preview Error",
          description: result.error || "Failed to generate PDF preview",
          variant: "destructive",
        });
        return;
      }

      // Convert base64 to blob and create URL
      const pdfBlob = base64ToBlob(result.pdfBase64!, 'application/pdf');
      const url = URL.createObjectURL(pdfBlob);
      
      // Clean up old URL if exists
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      
      setPdfUrl(url);
      setShowPreview(true);
    } catch (error) {
      console.error("Preview error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while generating preview",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  const handleClosePreview = () => {
    setShowPreview(false);
    // Clean up blob URL when closing
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="bg-linear-to-r from-[#FF6B6B] to-[#FF8787] px-8 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-xl">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Review Your Will</h2>
              <p className="text-rose-100 text-sm font-medium mt-1">Review all information before finalizing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="p-6 border border-rose-100 bg-rose-50/50 backdrop-blur-sm rounded-2xl flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-rose-500 shrink-0" />
        <div className="text-sm text-gray-700">
          <p className="font-bold text-gray-900 mb-1 leading-none">Important: Review Carefully</p>
          <p className="font-medium leading-relaxed">Please review all the information below carefully. You can expand each section to verify the details. Once you&apos;re satisfied, you can preview the PDF or download your will directly.</p>
        </div>
      </div>

      {/* Expand/Collapse Controls */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={expandAll}
          className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-bold px-6"
        >
          Expand All
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={collapseAll}
          className="rounded-xl border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-bold px-6"
        >
          Collapse All
        </Button>
      </div>

      {/* Review Sections */}
      <div className="space-y-4">
        {/* Step 1: Testator Details */}
        <Section title="Step 1: Testator Details" isOpen={openSections[0] || false} onToggle={() => toggleSection(0)}>
          <dl className="space-y-0">
            <KeyValue label="Full Name" value={formData.step1?.fullName} />
            <KeyValue label="Father Name" value={formData.step1?.fatherName} />
            {formData.step1?.fatherAadhaar && <KeyValue label="Father Aadhaar" value={formData.step1.fatherAadhaar} />}
            {formData.step1?.fatherPan && <KeyValue label="Father PAN" value={formData.step1.fatherPan} />}
            <KeyValue label="Mother Name" value={formData.step1?.motherName} />
            {formData.step1?.motherAadhaar && <KeyValue label="Mother Aadhaar" value={formData.step1.motherAadhaar} />}
            {formData.step1?.motherPan && <KeyValue label="Mother PAN" value={formData.step1.motherPan} />}
            <KeyValue label="Date of Birth" value={formData.step1?.dateOfBirth} />
            <KeyValue label="Age" value={formData.step1?.age} />
            <KeyValue label="Gender" value={formData.step1?.gender} />
            <KeyValue label="Nationality" value={formData.step1?.nationality} />
            <KeyValue label="Marital Status" value={formData.step1?.maritalStatus} />
            {formData.step1?.spouseDetails && (
              <>
                <KeyValue label="Spouse Name" value={formData.step1.spouseDetails.fullName} />
                <KeyValue label="Spouse DOB" value={formData.step1.spouseDetails.dateOfBirth} />
                <KeyValue label="Spouse Aadhaar" value={formData.step1.spouseDetails.aadhaarNumber} />
                <KeyValue label="Spouse PAN" value={formData.step1.spouseDetails.panNumber} />
              </>
            )}
            <KeyValue label="Religion" value={formData.step1?.religion} />
            <KeyValue label="Occupation" value={formData.step1?.occupation} />
            <KeyValue label="PAN Number" value={formData.step1?.panNumber} />
            <KeyValue label="Aadhaar Number" value={formData.step1?.aadhaarNumber} />
            <KeyValue label="Address" value={`${formData.step1?.residentialAddress?.addressLine1}, ${formData.step1?.residentialAddress?.city}, ${formData.step1?.residentialAddress?.state} ${formData.step1?.residentialAddress?.pinCode}`} />
            <KeyValue label="Mobile" value={formData.step1?.contactInfo?.mobileNumber} />
            <KeyValue label="Email" value={formData.step1?.contactInfo?.emailAddress} />
          </dl>
        </Section>

        {/* Step 2: Will Declaration */}
        <Section title="Step 2: Will Declaration" isOpen={openSections[1] || false} onToggle={() => toggleSection(1)}>
          <dl className="space-y-0">
            <KeyValue label="Sound Mind" value={formData.step2?.soundMind ? "Yes" : "No"} />
            <KeyValue label="Revoke Prior Wills" value={formData.step2?.revokePriorWills ? "Yes" : "No"} />
            <KeyValue label="Signing Date" value={formData.step2?.signingDate} />
            <KeyValue label="Signing Place" value={formData.step2?.signingPlace} />
          </dl>
        </Section>

        {/* Step 3: Executors */}
        <Section title="Step 3: Will Executors" isOpen={openSections[2] || false} onToggle={() => toggleSection(2)}>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Primary Executor</h4>
              <dl className="space-y-0">
                <KeyValue label="Name" value={formData.step3?.executor} />
                <KeyValue label="Relationship" value={formData.step3?.executorRelationship} />
                <KeyValue label="Father Name" value={formData.step3?.executorFatherName} />
                <KeyValue label="Aadhaar" value={formData.step3?.executorAadhaar} />
                <KeyValue label="PAN" value={formData.step3?.executorPan} />
                <KeyValue label="Address" value={formData.step3?.executorAddress} />
                <KeyValue label="City" value={formData.step3?.executorCity} />
                <KeyValue label="State" value={formData.step3?.executorState} />
                <KeyValue label="Phone" value={formData.step3?.executorPhoneNumber} />
                <KeyValue label="Email" value={formData.step3?.executorEmail} />
              </dl>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Backup Executor</h4>
              <dl className="space-y-0">
                <KeyValue label="Name" value={formData.step3?.backupExecutor} />
                <KeyValue label="Relationship" value={formData.step3?.backupExecutorRelationship} />
                <KeyValue label="Father Name" value={formData.step3?.backupExecutorFatherName} />
                <KeyValue label="Aadhaar" value={formData.step3?.backupExecutorAadhaar} />
                <KeyValue label="PAN" value={formData.step3?.backupExecutorPan} />
                <KeyValue label="Address" value={formData.step3?.backupExecutorAddress} />
                <KeyValue label="City" value={formData.step3?.backupExecutorCity} />
                <KeyValue label="State" value={formData.step3?.backupExecutorState} />
                <KeyValue label="Phone" value={formData.step3?.backupExecutorPhoneNumber} />
                <KeyValue label="Email" value={formData.step3?.backupExecutorEmail} />
              </dl>
            </div>
          </div>
        </Section>

        {/* Step 4: Dispute Resolver */}
        <Section title="Step 4: Dispute Resolver" isOpen={openSections[3] || false} onToggle={() => toggleSection(3)}>
          <dl className="space-y-0">
            <KeyValue label="Name" value={formData.step4?.disputeResolver} />
            <KeyValue label="Relation" value={formData.step4?.disputeResolverRelation} />
            <KeyValue label="Aadhaar" value={formData.step4?.disputeResolverAadhaar} />
            <KeyValue label="PAN" value={formData.step4?.disputeResolverPan} />
            <KeyValue label="Phone" value={formData.step4?.disputeResolverPhoneNumber} />
            <KeyValue label="Email" value={formData.step4?.disputeResolverEmail} />
          </dl>
        </Section>

        {/* Step 5: Witnesses */}
        <Section title="Step 5: Witness Details" isOpen={openSections[4] || false} onToggle={() => toggleSection(4)}>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Witness 1</h4>
              <dl className="space-y-0">
                <KeyValue label="Name" value={formData.step5?.witness1?.name} />
                <KeyValue label="Father Name" value={formData.step5?.witness1?.father} />
                <KeyValue label="Aadhaar" value={formData.step5?.witness1?.aadhaar} />
                <KeyValue label="Address" value={formData.step5?.witness1?.address} />
                <KeyValue label="City" value={formData.step5?.witness1?.city} />
                <KeyValue label="Phone" value={formData.step5?.witness1?.phoneNumber} />
                <KeyValue label="Email" value={formData.step5?.witness1?.email} />
              </dl>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Witness 2</h4>
              <dl className="space-y-0">
                <KeyValue label="Name" value={formData.step5?.witness2?.name} />
                <KeyValue label="Father Name" value={formData.step5?.witness2?.father} />
                <KeyValue label="Aadhaar" value={formData.step5?.witness2?.aadhaar} />
                <KeyValue label="Address" value={formData.step5?.witness2?.address} />
                <KeyValue label="City" value={formData.step5?.witness2?.city} />
                <KeyValue label="Phone" value={formData.step5?.witness2?.phoneNumber} />
                <KeyValue label="Email" value={formData.step5?.witness2?.email} />
              </dl>
            </div>
          </div>
        </Section>

        {/* Step 6: Beneficiaries */}
        <Section title="Step 6: Beneficiaries" isOpen={openSections[5] || false} onToggle={() => toggleSection(5)}>
          {formData.step6?.beneficiaries && formData.step6.beneficiaries.length > 0 ? (
            <div className="space-y-4">
              {formData.step6.beneficiaries.map((beneficiary, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Beneficiary {index + 1}</h4>
                  <dl className="space-y-0">
                    <KeyValue label="Name" value={beneficiary.name} />
                    <KeyValue label="Relation" value={beneficiary.relation} />
                    <KeyValue label="Date of Birth" value={beneficiary.dateOfBirth} />
                    <KeyValue label="Aadhaar" value={beneficiary.aadhaar} />
                    <KeyValue label="PAN" value={beneficiary.pan} />
                    <KeyValue label="Age" value={beneficiary.age} />
                    {beneficiary.guardianName && (
                      <>
                        <KeyValue label="Guardian Name" value={beneficiary.guardianName} />
                        <KeyValue label="Guardian Relation" value={beneficiary.guardianRelation} />
                      </>
                    )}
                  </dl>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No beneficiaries added</p>
          )}
        </Section>

        {/* Step 7: Charities */}
        <Section title="Step 7: Charities" isOpen={openSections[6] || false} onToggle={() => toggleSection(6)}>
          {formData.step7?.charities && formData.step7.charities.length > 0 ? (
            <div className="space-y-4">
              {formData.step7.charities.map((charity, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Charity {index + 1}</h4>
                  <dl className="space-y-0">
                    <KeyValue label="Name" value={charity.name} />
                    <KeyValue label="ID Number" value={charity.identificationNumber} />
                    <KeyValue label="Phone" value={charity.phoneNumber} />
                    <KeyValue label="Address" value={charity.address} />
                  </dl>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No charities added</p>
          )}
        </Section>

        {/* Step 8: Assets */}
        <Section title="Step 8: Assets" isOpen={openSections[7] || false} onToggle={() => toggleSection(7)}>
          {formData.step8?.assets && formData.step8.assets.length > 0 ? (
            <div className="space-y-4">
              {formData.step8.assets.map((asset, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Asset {index + 1}: {asset.type}</h4>
                  <dl className="space-y-0">
                  <dl className="space-y-0">
                    {Object.entries(asset.details || {})
                      .filter(([key, val]) => key !== 'images' && val !== null && val !== undefined && val !== '')
                      .map(([key, value]) => {
                        const formattedLabel = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        return <KeyValue key={key} label={formattedLabel} value={String(value)} />;
                      })}
                  </dl>
                  </dl>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No assets added</p>
          )}
        </Section>

        {/* Step 9: Residuary Clause */}
        <Section title="Step 9: Residuary Clause" isOpen={openSections[8] || false} onToggle={() => toggleSection(8)}>
          {formData.step9?.selectedRecipients && formData.step9.selectedRecipients.length > 0 ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">Distribution of remaining assets:</p>
              {formData.step9.selectedRecipients.map((recipient, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-700">{recipient}</span>
                  <span className="font-medium text-gray-900">
                    {formData.step9.distribution?.[recipient] || 0}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No residuary clause specified</p>
          )}
        </Section>

        {/* Step 10: Special Wishes */}
        <Section title="Step 10: Special Wishes" isOpen={openSections[9] || false} onToggle={() => toggleSection(9)}>
          <dl className="space-y-0">
            <KeyValue label="Funeral Wish" value={formData.step10?.funeralWish} />
            {formData.step10?.messages && formData.step10.messages.length > 0 && (
              <div className="py-2">
                <dt className="font-medium text-gray-600 mb-2">Messages</dt>
                <dd className="space-y-2">
                  {formData.step10.messages.map((msg, index) => (
                    <div key={index} className="bg-gray-50 rounded p-3">
                      <p className="text-sm font-medium text-gray-700">To: {msg.name} ({msg.relation})</p>
                      <p className="text-sm text-gray-600 mt-1">{msg.message}</p>
                    </div>
                  ))}
                </dd>
              </div>
            )}
            <KeyValue label="Other Arrangements" value={formData.step10?.otherArrangements} />
          </dl>
        </Section>

        {/* Step 11: Loan Repayment */}
        <Section title="Step 11: Loan Repayment" isOpen={openSections[10] || false} onToggle={() => toggleSection(10)}>
          {formData.step11?.accounts && formData.step11.accounts.length > 0 ? (
            <div className="space-y-4">
              {formData.step11.accounts.map((account, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Account {index + 1}</h4>
                  <dl className="space-y-0">
                    <KeyValue label="Bank Name" value={account.bankName} />
                    <KeyValue label="Account Number" value={account.accountNumber} />
                    <KeyValue label="Account Type" value={account.accountType} />
                    <KeyValue label="From Assets" value={account.fromAssets ? "Yes" : "No"} />
                  </dl>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No loan repayment accounts added</p>
          )}
        </Section>

        {/* Step 12: Organ Donation */}
        <Section title="Step 12: Organ Donation" isOpen={openSections[11] || false} onToggle={() => toggleSection(11)}>
          <dl className="space-y-0">
            <KeyValue label="Donation Choice" value={formData.step12?.donationChoice} />
            {formData.step12?.donationChoice === "specific" && (
              <>
                <div className="py-2 border-b border-gray-100">
                  <dt className="font-medium text-gray-600">Selected Organs</dt>
                  <dd className="text-gray-900 mt-1">
                    {formData.step12.selectedOrgans && formData.step12.selectedOrgans.length > 0
                      ? formData.step12.selectedOrgans.join(", ")
                      : "None selected"}
                  </dd>
                </div>
                <div className="py-2">
                  <dt className="font-medium text-gray-600">Selected Tissues</dt>
                  <dd className="text-gray-900 mt-1">
                    {formData.step12.selectedTissues && formData.step12.selectedTissues.length > 0
                      ? formData.step12.selectedTissues.join(", ")
                      : "None selected"}
                  </dd>
                </div>
              </>
            )}
          </dl>
        </Section>

        {/* Annexures: Asset Images */}
        <Section title="Annexures: Asset Images" isOpen={openSections[12] || false} onToggle={() => toggleSection(12)}>
          {(() => {
            const assetsWithImages = formData.step8?.assets?.filter(a => a.details?.images && a.details.images.length > 0) || [];

            if (assetsWithImages.length === 0) {
              return (
                <div className="text-center py-8 text-gray-500 italic">
                  No images have been attached to any assets.
                  <br />
                  <span className="text-xs">Upload images in Step 8 (Assets) to see them here.</span>
                </div>
              );
            }

            return (
              <div className="space-y-8">
                {assetsWithImages.map((asset, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-3">
                       <span className="bg-rose-100 text-rose-600 px-3 py-1 rounded-lg text-xs font-bold border border-rose-200 uppercase tracking-wider">
                         {asset.type}
                       </span>
                       {asset.details?.description || `Asset ${index + 1}`}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {asset.details?.images?.map((img: AssetImage, i: number) => (
                        <div key={i} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <Image
                            src={img.data}
                            alt={`Asset Image ${i + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </Section>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-6 pt-10 border-t-2 border-dashed border-gray-100">
        <Button
          type="button"
          onClick={handlePreviewPDF}
          disabled={isGeneratingPreview}
          className="h-14 px-10 bg-linear-to-r from-[#FF6B6B] to-[#FF8787] text-white rounded-xl shadow-lg shadow-rose-100 hover:from-[#FF5555] hover:to-[#FF7676] transition-all font-bold tracking-tight active:scale-[0.98] flex items-center gap-3"
        >
          {isGeneratingPreview ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Preview...
            </>
          ) : (
            <>
              <Eye className="h-5 w-5" />
              Preview Document
            </>
          )}
        </Button>
      </div>

      {/* PDF Preview Modal */}
      <Dialog open={showPreview} onOpenChange={handleClosePreview}>
        <DialogContent className="w-[70vw] sm:max-w-[70vw] min-w-[70vw] h-[90vh] p-0 border-none overflow-hidden rounded-2xl shadow-2xl bg-gray-900">
          <div className="w-full h-full">
            {pdfUrl ? (
              <iframe
                src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                className="w-full h-full border-0"
                title="Will PDF Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Loading PDF preview...</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Completion Message */}
      <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-100/50 flex items-start gap-4">
        <div className="p-2 bg-emerald-500 rounded-xl">
          <CheckCircle2 className="h-5 w-5 text-white shrink-0" />
        </div>
        <div className="text-sm text-gray-700">
          <p className="font-bold text-emerald-900 mb-1">You&apos;re almost done!</p>
          <p className="font-medium leading-relaxed">Review the information above, preview the document if needed, and then click the &quot;Download PDF&quot; button below to get your legal will document.</p>
        </div>
      </div>
    </div>
  );
}
