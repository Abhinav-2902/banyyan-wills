"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CompleteWillFormData } from "@/lib/validations/will";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-lg font-semibold text-[#5E4B8C]">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-gray-100">
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
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-linear-to-r from-[#8B7BB8] to-[#432371] rounded-lg">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-[#5E4B8C]">Review Your Will</h2>
          <p className="text-sm text-gray-600">Please review all information before downloading</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">Important: Review Carefully</p>
          <p>Please review all the information below carefully. You can expand each section to verify the details. Once you&apos;re satisfied, you can preview the PDF or download your will directly.</p>
        </div>
      </div>

      {/* Expand/Collapse Controls */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={expandAll}
          className="text-sm"
        >
          Expand All
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={collapseAll}
          className="text-sm"
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
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                       <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs border border-purple-200">
                         {asset.type}
                       </span>
                       {asset.details?.description || `Asset ${index + 1}`}
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {asset.details.images.map((img: any, i: number) => (
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
      <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={handlePreviewPDF}
          disabled={isGeneratingPreview}
          className="flex items-center gap-2"
        >
          {isGeneratingPreview ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Preview...
            </>
          ) : (
            <>
              <Eye className="h-5 w-5" />
              Preview PDF
            </>
          )}
        </Button>
      </div>

      {/* PDF Preview Modal */}
      <Dialog open={showPreview} onOpenChange={handleClosePreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Will Document Preview
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClosePreview}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
            <DialogDescription>
              This is the exact PDF that will be downloaded. Scroll to view all pages.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden" style={{ height: 'calc(90vh - 120px)' }}>
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
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
      <div className="bg-green-50 rounded-lg p-4 border border-green-200 flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div className="text-sm text-green-800">
          <p className="font-medium">You&apos;re almost done!</p>
          <p className="mt-1">Review the information above, preview the PDF if needed, and then click the &quot;Download PDF&quot; button below to get your will document.</p>
        </div>
      </div>
    </div>
  );
}
