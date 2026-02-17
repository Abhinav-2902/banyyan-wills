"use client";

import { useEffect, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock, History } from "lucide-react";
import { getWillHistory } from "@/server/actions/will-history";
import { format } from "date-fns";

interface WillHistoryProps {
  willId: string;
}

interface WillVersion {
  id: string;
  createdAt: Date;
  commitMsg: string | null;
  versionNum: number;
  changes?: {
    field: string;
    section: string;
    oldValue: unknown;
    newValue: unknown;
  }[];
}



export function WillHistory({ willId }: WillHistoryProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<WillVersion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen) {
      setLoading(true);
    }
  };

  useEffect(() => {
    if (open) {
      // Fetch history when dialog opens
      getWillHistory(willId)
        .then((result) => {
          if (result.success && result.data) {
             const parsedHistory = result.data.map((item) => ({
                id: item.id,
                versionNum: item.versionNum,
                commitMsg: item.commitMsg,
                createdAt: new Date(item.createdAt),
                // Safely cast changes from JSON
                changes: (item.changes as unknown) as WillVersion['changes']
             }));
             setHistory(parsedHistory);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [willId, open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 text-gray-600 hover:text-[#FF6B6B] hover:border-[#FF6B6B] hover:bg-white transition-colors"
          title="View Version History"
        >
          <History className="h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#FF6B6B]" />
            Version History
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
               <div className="animate-spin h-6 w-6 border-2 border-[#FF6B6B] border-t-transparent rounded-full" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No version history available.</p>
          ) : (
            <div className="relative border-l border-gray-200 ml-3 space-y-8">
              {history.map((version) => (
                <div key={version.id} className="ml-6 relative">
                  <span className="absolute -left-[29px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B6B] ring-4 ring-white">
                     <span className="text-[10px] font-bold text-white">{version.versionNum}</span>
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-gray-900">
                      {version.commitMsg || "Saved changes"}
                    </span>
                    <span className="text-xs text-gray-500 mb-1">
                      {format(version.createdAt, "PPP p")}
                    </span>

                    {/* Detailed Changes */}
                    {version.changes && version.changes.length > 0 && (
                      <div className="bg-gray-50 rounded-md p-2 space-y-2 mt-1 border border-gray-100">
                        {version.changes.map((change, idx) => (
                          <div key={idx} className="text-xs">
                            <span className="font-semibold text-gray-700">{change.field}:</span>
                            <div className="pl-2 mt-0.5 grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-gray-600">
                               {/* Only show Old Value if it wasn't empty/null */}
                               {change.oldValue !== null && change.oldValue !== undefined && typeof change.oldValue !== 'object' && String(change.oldValue).trim() !== '' && (
                                   <>
                                     <span className="text-red-500 line-through opacity-70 justify-self-end">Old:</span>
                                     <span>{String(change.oldValue)}</span>
                                   </>
                               )}
                               <span className="text-green-600 font-medium justify-self-end">New:</span>
                               <span className="font-medium text-gray-900">
                                 {typeof change.newValue === 'object' ? JSON.stringify(change.newValue) : String(change.newValue)}
                               </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
