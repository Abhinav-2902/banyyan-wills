"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { downloadWillPDFAction } from "@/server/actions/download-will-pdf";
import { useToast } from "@/hooks/use-toast";

interface DownloadPDFButtonProps {
  willId: string;
  disabled?: boolean;
  onBeforeDownload?: () => Promise<void>;
}

export function DownloadPDFButton({ willId, disabled, onBeforeDownload }: DownloadPDFButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Execute any pre-download logic (e.g., saving the form)
      if (onBeforeDownload) {
        await onBeforeDownload();
      }

      const result = await downloadWillPDFAction(willId);

      if (!result.success) {
          toast({
            title: "Validation Error",
            description: (
              <div className="whitespace-pre-wrap max-h-[300px] overflow-y-auto text-xs font-mono">
                {result.error || "Failed to generate PDF"}
              </div>
            ),
            variant: "destructive",
          });
        return;
      }

      // Convert base64 to blob and trigger download
      const pdfBlob = base64ToBlob(result.pdfBase64!, 'application/pdf');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename || 'Will.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Your Will has been downloaded and marked as completed!",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      className="gap-2"
      size="lg"
    >
      {isDownloading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating PDF...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download Will PDF
        </>
      )}
    </Button>
  );
}

// Helper function to convert base64 to blob
function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
