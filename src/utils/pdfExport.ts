import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DONORS_BY_BLOOD_GROUP,
  BLOOD_STOCK_DATA,
  DONOR_REGISTRATION_TRENDS,
  RECENT_BLOOD_REQUESTS,
} from '../data/mockData';
import { redPulseLogoBase64 } from '../assets/logoBase64';

export interface ReportExportOptions {
  timeRange: '30d' | '90d' | 'year' | 'all';
  adminName?: string;
}

export function generateReportPDF(options: ReportExportOptions): void {
  const { timeRange, adminName = 'Shoufiq Rahman Shifat' } = options;

  const timeRangeLabels: Record<string, string> = {
    '30d': 'Last 30 Days (30D)',
    '90d': 'Last 90 Days (Quarterly)',
    'year': 'Annual Period (1 Year)',
    'all': 'All Time (Historical)',
  };

  const periodLabel = timeRangeLabels[timeRange] || 'Last 30 Days';
  const totalDonors = 1248;
  const totalDonations = 892;
  const totalUnitsAvailable = BLOOD_STOCK_DATA.reduce((sum, item) => sum + item.units, 0);
  const criticalGroupsCount = BLOOD_STOCK_DATA.filter((s) => s.status === 'Low').length;

  // Initialize PDF in Portrait A4 format
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // Top Accent Banner (Brand Crimson Red)
  doc.setFillColor(220, 38, 38); // #dc2626
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Official Transparent Logo Embedding (Heart / ECG / Blood drop)
  try {
    doc.addImage(redPulseLogoBase64, 'PNG', margin, 8, 16, 16);
  } catch (err) {
    console.warn('Could not embed logo in PDF:', err);
  }

  // Header Title & Brand
  const titleLeft = margin + 18.5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38);
  doc.text('RedPulse', titleLeft, 15);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('CENTRAL BLOOD DONOR MANAGEMENT & INVENTORY NETWORK', titleLeft, 19.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Every Beat Saves a Life • Official Demographics & Trajectory Audit Report', titleLeft, 24);

  // Metadata Block (Right-aligned)
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`Generated: ${dateStr}`, pageWidth - margin, 15, { align: 'right' });
  doc.text(`Reporting Scope: ${periodLabel}`, pageWidth - margin, 19.5, { align: 'right' });
  doc.text(`Author: ${adminName} (Lead Administrator)`, pageWidth - margin, 24, { align: 'right' });

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, 28, pageWidth - margin, 28);

  // Executive KPI Summary Table
  autoTable(doc, {
    startY: 32,
    theme: 'plain',
    styles: {
      fontSize: 8.5,
      cellPadding: 3,
    },
    head: [
      [
        'Total Registered Donors',
        'Total Units Donated',
        'Current Bank Stock',
        'SOS Match & Fulfillment',
      ],
    ],
    body: [
      [
        `${totalDonors.toLocaleString()} Active Donors\n(+12.0% growth)`,
        `${totalDonations.toLocaleString()} Collected Units\n(+8.4% intake)`,
        `${totalUnitsAvailable} Bags Available\n(${criticalGroupsCount} Groups at Low Reserve)`,
        '96.4% Success Rate\n(Avg Match Time: 18 min)',
      ],
    ],
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: [100, 116, 139],
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fillColor: [241, 245, 249],
      textColor: [15, 23, 42],
      fontStyle: 'bold',
      halign: 'center',
    },
    margin: { left: margin, right: margin },
  });

  let currentY = (doc as any).lastAutoTable.finalY + 7;

  // Section 1: Blood Stock Inventory Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Blood Stock Reserve Levels & Shortage Audit', margin, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
    },
    head: [['Blood Group', 'Available Units', 'Status', 'Safety Threshold', 'Capacity Fill', 'Audit Assessment']],
    body: BLOOD_STOCK_DATA.map((item) => {
      const isLow = item.status === 'Low';
      const fillPercent = Math.round((item.units / 150) * 100);
      return [
        item.bloodGroup,
        `${item.units} Units`,
        item.status.toUpperCase(),
        '30 Units',
        `${fillPercent}%`,
        isLow ? 'CRITICAL - Urgent replenishment needed' : 'OPTIMAL - Safe operating capacity',
      ];
    }),
    headStyles: {
      fillColor: [220, 38, 38],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center', cellWidth: 24 },
      1: { halign: 'center', cellWidth: 26 },
      2: { halign: 'center', fontStyle: 'bold', cellWidth: 24 },
      3: { halign: 'center', cellWidth: 28 },
      4: { halign: 'center', cellWidth: 22 },
      5: { cellWidth: 'auto' },
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 2) {
        if (data.cell.raw === 'LOW') {
          data.cell.styles.textColor = [185, 28, 28]; // Dark red
          data.cell.styles.fillColor = [254, 242, 242]; // Light red
        } else {
          data.cell.styles.textColor = [4, 120, 87]; // Emerald
          data.cell.styles.fillColor = [240, 253, 244]; // Light green
        }
      }
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Section 2: Donor Group Demographics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Donor Population Demographics by Blood Group', margin, currentY);

  const compatibilityNotes: Record<string, string> = {
    'O-': 'Universal Red Cell Donor (Highest Clinical Priority)',
    'O+': 'Most requested group for O+, A+, B+, AB+ positive recipients',
    'A+': 'High regional prevalence; compatible with A+, AB+',
    'A-': 'Compatible with A-, A+, AB-, AB+',
    'B+': 'High regional demand; compatible with B+, AB+',
    'B-': 'Compatible with B-, B+, AB-, AB+',
    'AB+': 'Universal Platelet & Plasma Donor; Universal Recipient',
    'AB-': 'Universal Plasma Donor; compatible with AB-, AB+',
  };

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
    },
    head: [['Blood Group', 'Registered Donors', 'Network Share', 'Clinical Transfusion Role']],
    body: DONORS_BY_BLOOD_GROUP.map((d) => {
      const share = `${((d.count / totalDonors) * 100).toFixed(1)}%`;
      return [d.bloodGroup, `${d.count} Donors`, share, compatibilityNotes[d.bloodGroup] || 'Standard compatibility'];
    }),
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center', cellWidth: 26 },
      1: { halign: 'center', fontStyle: 'bold', cellWidth: 32 },
      2: { halign: 'center', cellWidth: 28 },
      3: { cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  // Check if we need to add a page or continue
  if ((doc as any).lastAutoTable.finalY > pageHeight - 55) {
    doc.addPage();
    currentY = 16;
  } else {
    currentY = (doc as any).lastAutoTable.finalY + 8;
  }

  // Section 3: Monthly Trajectory Performance
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Annual Intake Trajectory & Acquisition Trends', margin, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'striped',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
    },
    head: [['Month', 'New Donors Registered', 'Cumulative Active Donors', 'Monthly Intake Velocity']],
    body: DONOR_REGISTRATION_TRENDS.map((t, idx, arr) => {
      const prev = idx > 0 ? arr[idx - 1].newDonors : t.newDonors;
      const diff = t.newDonors - prev;
      const trendStr = diff >= 0 ? `+${diff} vs prev month` : `${diff} vs prev month`;
      return [t.month, `+${t.newDonors} Donors`, `${t.totalDonors} Total Donors`, trendStr];
    }),
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'center', cellWidth: 24 },
      1: { halign: 'center', cellWidth: 42 },
      2: { halign: 'center', cellWidth: 45 },
      3: { halign: 'center', cellWidth: 'auto' },
    },
    margin: { left: margin, right: margin },
  });

  currentY = (doc as any).lastAutoTable.finalY + 8;

  // Section 4: Recent Emergency Requisitions
  if (currentY > pageHeight - 50) {
    doc.addPage();
    currentY = 16;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('4. Recent Hospital Emergency Requisitions Sample', margin, currentY);

  autoTable(doc, {
    startY: currentY + 3,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 2.2,
      textColor: [30, 41, 59],
    },
    head: [['Patient / Recipient', 'Hospital / Medical Facility', 'Blood Group', 'Time Horizon', 'Requisition Status']],
    body: RECENT_BLOOD_REQUESTS.map((r) => [
      r.donorName,
      r.hospital,
      r.bloodGroup,
      r.timeAgo,
      r.status.toUpperCase(),
    ]),
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 38 },
      1: { cellWidth: 'auto' },
      2: { halign: 'center', fontStyle: 'bold', cellWidth: 26 },
      3: { halign: 'center', cellWidth: 30 },
      4: { halign: 'center', fontStyle: 'bold', cellWidth: 32 },
    },
    margin: { left: margin, right: margin },
  });

  // Document properties
  doc.setProperties({
    title: `RedPulse Management & Inventory Report - ${periodLabel}`,
    subject: 'RedPulse Blood Donor & Inventory Trajectory Audit Report',
    author: adminName,
    keywords: 'RedPulse, blood donation, inventory audit, healthcare',
    creator: 'RedPulse Healthcare Administration',
  });

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  const reportRef = `REDPULSE-RPT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    // Bottom divider
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);

    // Footer text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);

    doc.text(
      'CONFIDENTIAL - RedPulse Voluntary Blood Donor & Healthcare Management Platform',
      margin,
      pageHeight - 6.5
    );

    doc.text(
      `Ref: ${reportRef} • Page ${i} of ${totalPages}`,
      pageWidth - margin,
      pageHeight - 6.5,
      { align: 'right' }
    );
  }

  // Trigger browser PDF download
  const dateFile = new Date().toISOString().split('T')[0];
  doc.save(`RedPulse_Report_${dateFile}.pdf`);
}
