import { jsPDF } from 'jspdf';
import { ExamAttempt } from '../types';

export function generateAttemptPDF(attempt: ExamAttempt): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Background decoration / Border
  doc.setDrawColor(20, 83, 45); // Forest emerald green
  doc.setLineWidth(1.2);
  doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

  doc.setDrawColor(203, 213, 225); // Light slate inner border
  doc.setLineWidth(0.4);
  doc.rect(11, 11, pageWidth - 22, pageHeight - 22);

  // Header Banner Background
  doc.setFillColor(15, 23, 42); // Dark slate navy
  doc.rect(12, 12, pageWidth - 24, 34, 'F');

  // Header Text
  doc.setTextColor(248, 250, 252);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('SUSTAINABILITY EXCELLENCE ASSOCIATE (SEA)', pageWidth / 2, 22, { align: 'center' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(187, 247, 208); // Emerald light
  doc.text('OFFICIAL MOCK EXAMINATION SCORE RECORD & CANDIDATE ATTEMPT AUDIT', pageWidth / 2, 29, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225);
  doc.text('STANDALONE VERIFIED INDEPENDENT ASSESSMENT • TIME-STAMPED AUDIT TRAIL', pageWidth / 2, 36, { align: 'center' });

  // Security & Authentication Bar
  doc.setFillColor(241, 245, 249);
  doc.rect(14, 49, pageWidth - 28, 14, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(14, 49, pageWidth - 28, 14, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('AUTHENTICATION STAMP:', 18, 55);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 64, 175);
  doc.text(attempt.authCode, 60, 55);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('DATE & TIME STAMP:', 18, 60);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${attempt.formattedDate} at ${attempt.formattedTime}`, 60, 60);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9); // Amber
  doc.text('VERIFICATION STATUS: NON-TRANSFERABLE / INDIVIDUAL TEST', pageWidth - 18, 57.5, { align: 'right' });

  // Candidate Information Box
  let y = 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('CANDIDATE & EXAMINATION PROFILE', 15, y);

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(15, y + 2, pageWidth - 15, y + 2);

  y += 9;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Candidate Name:', 18, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.text(attempt.studentName, 55, y);

  if (attempt.studentId) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('Student ID / Ref:', 125, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(attempt.studentId, 160, y);
  }

  y += 7;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Examination Title:', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(attempt.examTitle, 55, y);

  y += 6;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Time Allotment:', 18, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const minutes = Math.floor(attempt.timeSpentSeconds / 60);
  const seconds = attempt.timeSpentSeconds % 60;
  doc.text(`${minutes} min ${seconds} sec (Allocated Window: 120 minutes)`, 55, y);

  // Score Summary Card
  y += 11;
  const cardHeight = 32;
  const isPass = attempt.passed;

  doc.setFillColor(isPass ? 240 : 254, isPass ? 253 : 242, isPass ? 244 : 242);
  doc.rect(14, y, pageWidth - 28, cardHeight, 'F');
  doc.setDrawColor(isPass ? 34 : 239, isPass ? 197 : 68, isPass ? 94 : 68);
  doc.setLineWidth(0.8);
  doc.rect(14, y, pageWidth - 28, cardHeight, 'S');

  // Left column: Score metrics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('RAW SCORE', 25, y + 9);
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text(`${attempt.correctCount} / ${attempt.totalQuestions}`, 25, y + 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Accuracy: ${attempt.scorePercentage.toFixed(1)}%`, 25, y + 25);

  // Middle column: Scaled Score
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text('SCALED SCORE (GBCI)', 78, y + 9);
  doc.setFontSize(18);
  doc.setTextColor(isPass ? 21 : 185, isPass ? 128 : 28, isPass ? 61 : 28);
  doc.text(`${attempt.scaledScore} / 200`, 78, y + 18);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Passing Threshold: 170 / 200', 78, y + 25);

  // Right column: Final Assessment Result Badge
  doc.setFillColor(isPass ? 22 : 185, isPass ? 101 : 28, isPass ? 52 : 28);
  doc.rect(135, y + 5, 55, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  doc.text(isPass ? 'RESULT: PASS' : 'RESULT: NOT PASSED', 162.5, y + 15, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(isPass ? 'Meets SEA Standard' : 'Retake Recommended', 162.5, y + 21, { align: 'center' });

  // Module Breakdown Table
  y += cardHeight + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('PERFORMANCE BREAKDOWN BY SYLLABUS MODULE', 15, y);

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.5);
  doc.line(15, y + 2, pageWidth - 15, y + 2);

  // Table header
  y += 7;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Module / Knowledge Domain', 18, y + 5);
  doc.text('Items', 118, y + 5, { align: 'center' });
  doc.text('Correct', 140, y + 5, { align: 'center' });
  doc.text('Score (%)', 162, y + 5, { align: 'center' });
  doc.text('Proficiency', 185, y + 5, { align: 'center' });

  y += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  attempt.moduleScores.forEach((m, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, 6.5, 'F');
    }
    doc.setTextColor(15, 23, 42);
    // Truncate module title if long
    const cleanTitle = m.moduleName.length > 52 ? m.moduleName.substring(0, 50) + '...' : m.moduleName;
    doc.text(cleanTitle, 18, y + 4.5);
    doc.text(String(m.total), 118, y + 4.5, { align: 'center' });
    doc.text(String(m.correct), 140, y + 4.5, { align: 'center' });
    doc.text(`${m.percentage.toFixed(0)}%`, 162, y + 4.5, { align: 'center' });

    const status = m.percentage >= 75 ? 'Mastery' : m.percentage >= 60 ? 'Competent' : 'Focus Area';
    doc.setFont('helvetica', 'bold');
    if (m.percentage >= 75) doc.setTextColor(21, 128, 61);
    else if (m.percentage >= 60) doc.setTextColor(180, 83, 9);
    else doc.setTextColor(185, 28, 28);
    doc.text(status, 185, y + 4.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    y += 6.5;
  });

  // Authentication & Verification Statement Box
  y = Math.max(y + 8, 222);
  doc.setFillColor(248, 250, 252);
  doc.rect(14, y, pageWidth - 28, 38, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.rect(14, y, pageWidth - 28, 38, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('EXAMINATION INTEGRITY & ANTI-SHARING AUTHENTICATION DECLARATION', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const text1 = 'This authentic performance certificate verifies that the designated candidate independently completed a randomized mock assessment generated from the authoritative SEA examination syllabus pool within the statutory 2-hour window. This document contains a cryptographically seeded authentication code and exact ISO timestamp.';
  const textLines1 = doc.splitTextToSize(text1, pageWidth - 36);
  doc.text(textLines1, 18, y + 11);

  const text2 = 'Unlimited practice attempts are supported to facilitate active spaced retrieval. To safeguard academic integrity and prevent score page sharing between students, every attempt is verified against unique session parameters and candidate timestamps.';
  const textLines2 = doc.splitTextToSize(text2, pageWidth - 36);
  doc.text(textLines2, 18, y + 21);

  // Digital Signatures
  doc.setDrawColor(148, 163, 184);
  doc.line(20, y + 33, 75, y + 33);
  doc.setFontSize(6.5);
  doc.text('Course Assessment System / Exam Engine', 20, y + 36);

  doc.line(125, y + 33, 185, y + 33);
  doc.text(`Candidate: ${attempt.studentName}`, 125, y + 36);

  // Footer
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Generated by SEA Exam Practice Engine • Standalone Local HTML Deployment • Confidential Examination Record', pageWidth / 2, pageHeight - 11, { align: 'center' });

  // Save the PDF
  const safeFilename = `SEA_ScoreReport_${attempt.studentName.replace(/[^a-zA-Z0-9]/g, '_')}_${attempt.authCode}.pdf`;
  doc.save(safeFilename);
}
