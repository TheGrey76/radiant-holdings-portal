import { useState, useCallback } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { UploadedDoc, ExtractionResult, ProcessingStep } from "./ai-types";

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Extract text from file for non-image types
async function fileToText(file: File): Promise<string | null> {
  if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.csv')) {
    return await file.text();
  }
  return null;
}

export function useAIExtraction() {
  const [processing, setProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('reading');
  const [extraction, setExtraction] = useState<ExtractionResult | null>(null);

  const analyze = useCallback(async (documents: UploadedDoc[]): Promise<ExtractionResult | null> => {
    if (documents.length === 0) {
      toast.error('No documents to analyze');
      return null;
    }

    setProcessing(true);
    setProcessingStep('reading');

    try {
      // Step 1: Read documents and convert to base64
      const docPayloads = [];
      for (const doc of documents) {
        const base64 = await fileToBase64(doc.file);
        const textContent = await fileToText(doc.file);
        docPayloads.push({
          name: doc.file.name,
          docType: doc.type,
          mediaType: doc.file.type,
          base64,
          textContent,
        });
      }

      setProcessingStep('extracting');

      // Step 2: Call edge function
      const { data, error } = await supabase.functions.invoke('gp-scoring-ai', {
        body: {
          action: 'extract',
          documents: docPayloads,
        },
      });

      setProcessingStep('mapping');

      if (error) {
        throw new Error(error.message || 'Analysis failed');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setProcessingStep('done');
      setExtraction(data as ExtractionResult);
      toast.success('Document analysis complete');
      return data as ExtractionResult;
    } catch (error: any) {
      toast.error(error.message || 'Analysis failed');
      return null;
    } finally {
      setProcessing(false);
    }
  }, []);

  const generateNotes = useCallback(async (pillarName: string, pillarData: any): Promise<string | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('gp-scoring-ai', {
        body: {
          action: 'generate_notes',
          pillarName,
          pillarData,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);

      return data?.notes || null;
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate summary');
      return null;
    }
  }, []);

  return { processing, processingStep, extraction, setExtraction, analyze, generateNotes };
}
