
import { useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

export function usePdfExport() {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = async (elementId: string, fileName: string) => {
    try {
      setIsExporting(true);
      
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error("Element to export not found");
      }

      // Create a canvas from the element
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // A4 size in mm
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${fileName}.pdf`);
      
      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to download resume. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToPdf, isExporting };
}
