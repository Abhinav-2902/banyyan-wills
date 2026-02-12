import { renderToBuffer } from '@react-pdf/renderer';
import { WillPDFDocument } from './will-pdf-template';
import { CompleteWillFormData } from '@/lib/validations/will';

/**
 * Generate PDF buffer from will data
 */
export async function generateWillPDF(data: CompleteWillFormData): Promise<Buffer> {
  try {
    const pdfBuffer = await renderToBuffer(<WillPDFDocument data={data} />);
    return pdfBuffer;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

/**
 * Generate PDF and return as base64 string for download
 */
export async function generateWillPDFBase64(data: CompleteWillFormData): Promise<string> {
  const buffer = await generateWillPDF(data);
  return buffer.toString('base64');
}
