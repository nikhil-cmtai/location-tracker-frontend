"use client";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import { Printer, FileText, FileSpreadsheet } from "lucide-react";

interface ExportButtonsProps<T extends object> {
  data: T[];
  headers: { key: keyof T; label: string }[];
  filename: string;
  allData?: T[];
}

const formatDateTime = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const getDisplayValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === 'object') {
    const obj = value as { stopName?: string; depotCustomer?: string; layoutName?: string; routeName?: string };
    return obj.stopName || obj.depotCustomer || obj.layoutName || obj.routeName || '[object Object]';
  }
  return String(value);
};

export default function ExportButtons<T extends object>({
  data,
  headers,
  filename,
  allData,
}: ExportButtonsProps<T>) {
  // TODO: Replace with actual logged-in user when auth is implemented
  const userName = 'Administrator';

  const exportData = allData && allData.length > 0 ? allData : data;

  const handleExcelExport = () => {
    const headerLabels = headers.map((h) => h.label);
    const dataAsArrays = exportData.map((row) =>
      headers.map((header) => getDisplayValue(row[header.key]))
    );

    const ws_data = [headerLabels, ...dataAsArrays];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);

    const colWidths = headerLabels.map((_, i) => ({
      wch:
        Math.max(
          headerLabels[i].length,
          ...dataAsArrays.map((row) => String(row[i]).length)
        ) + 2,
    }));
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const handlePdfExport = () => {
    const doc = new jsPDF();
    const tableHead = [headers.map((h) => h.label)];
    const tableBody = exportData.map((row) =>
      headers.map((header) => getDisplayValue(row[header.key]))
    );

    const title = filename
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

    doc.setFontSize(12);
    doc.setFont("normal", 'normal');
    doc.text(title, 16, 21);

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: 30,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      didDrawPage: (data) => {
        const reportDate = `Report generated on: ${formatDateTime(new Date())}`;
        const userInfo = `User: ${userName}`;

        doc.setFontSize(9);
        doc.setTextColor(100);

        doc.text(userInfo, data.settings.margin.left, 15);

        const dateWidth = doc.getStringUnitWidth(reportDate) * doc.getFontSize() / doc.internal.scaleFactor;
        const dateX = doc.internal.pageSize.getWidth() - data.settings.margin.right - dateWidth;
        doc.text(reportDate, dateX, 15);

        const pageCount = (doc as jsPDF & { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          data.settings.margin.left,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    } as UserOptions);

    doc.save(`${filename}.pdf`);
  };

  const handlePrint = () => {
    const title = filename.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const generatedDate = formatDateTime(new Date());

    const rows = exportData.map((row) =>
      `<tr>${headers
        .map((h) => `<td style="padding: 6px; border: 1px solid #ddd;">${getDisplayValue(row[h.key])}</td>`)
        .join('')}</tr>`
    );

    const headerRow = `<tr>${headers
      .map((h) => `<th style="padding: 8px; border: 1px solid #ddd; background: #f3f4f6; color: #333 font-weight: bold;;">${h.label}</th>`)
      .join('')}</tr>`;

    const reportInfo = `
      <div style="margin-bottom: 15px; font-size: 12px; color: #555;">
        <p style="margin: 2px 0;"><strong>User:</strong> ${userName}</p>
        <p style="margin: 2px 0;"><strong>Report generated on:</strong> ${generatedDate}</p>
      </div>
    `;

    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${title}</title>
        <style>body{font-family: Arial, sans-serif;} table{border-collapse: collapse; width: 100%;} th, td{text-align: left;}</style>
      </head>
      <body>
        <h2 style="margin-bottom: 10px; font-weight: normal; font-size: 12px;">${title}</h2>
        ${reportInfo}
        <table><thead>${headerRow}</thead><tbody>${rows.join('')}</tbody></table>
      </body>
    </html>`;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.open();
      newWindow.document.write(html);
      newWindow.document.close();
      setTimeout(() => {
        newWindow.print();
      }, 250);
    }
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={handleExcelExport}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-200"
      >
        <FileSpreadsheet className="w-5 h-5 text-[var(--text-secondary)]" />
      </button>
      <button
        onClick={handlePdfExport}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-200"
      >
        <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
      </button>
      <button
        onClick={handlePrint}
        className="rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-200"
      >
        <Printer className="w-5 h-5 text-[var(--text-secondary)]" />
      </button>
    </div>
  );
}