// =============================================================
// exporters.js — convert proposal text to .docx and .pdf
// Used by the Proposal Generator page.
// =============================================================

import { Document, Packer, Paragraph, TextRun, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'
import jsPDF from 'jspdf'

// Detect "ALL CAPS SECTION:" headers
const isSectionHeader = (line) => /^[A-Z][A-Z\s&'\-]+:$/.test(line.trim())

// Convert plain text into .docx, detecting section headers
export async function downloadAsDocx(filename, content) {
  const lines = content.split('\n')

  const children = lines.map((line) => {
    const trimmed = line.trim()
    const isHeader = isSectionHeader(trimmed)
    const isEmpty = trimmed === ''

    return new Paragraph({
      alignment: AlignmentType.LEFT,
      spacing: { after: isEmpty ? 120 : 160, before: 0, line: 300 },
      children: [
        new TextRun({
          text: line || ' ',
          bold: isHeader,
          size: 22, // 11pt
          font: 'Calibri',
          color: isHeader ? '4F46E5' : '1F2937',
        }),
      ],
    })
  })

  // Add a title paragraph at the top
  const titleParagraph = new Paragraph({
    alignment: AlignmentType.LEFT,
    spacing: { after: 320, before: 0 },
    children: [
      new TextRun({
        text: `Proposal: ${filename}`,
        bold: true,
        size: 32, // 16pt
        font: 'Calibri',
        color: '4F46E5',
      }),
    ],
  })

  const doc = new Document({
    creator: 'Freela — AI Freelance Coach',
    title: filename,
    description: 'Generated freelance proposal',
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children: [titleParagraph, ...children],
      },
    ],
  })

  const blob = await Packer.toBlob(doc)
  saveAs(blob, `${sanitizeFilename(filename)}.docx`)
}

// Convert plain text to a formatted PDF
export function downloadAsPdf(filename, content) {
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
  })

  const pageWidth  = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin     = 60
  const maxWidth   = pageWidth - 2 * margin

  let y = margin

  // Title
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(79, 70, 229) // brand-600
  const titleLines = doc.splitTextToSize(`Proposal: ${filename}`, maxWidth)
  for (const t of titleLines) {
    if (y > pageHeight - margin) { doc.addPage(); y = margin }
    doc.text(t, margin, y)
    y += 20
  }
  y += 8

  // Divider
  doc.setDrawColor(226, 232, 240) // slate-200
  doc.line(margin, y, pageWidth - margin, y)
  y += 18

  // Body
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    const isHeader = isSectionHeader(trimmed)
    const isEmpty  = trimmed === ''

    if (isHeader) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.setTextColor(79, 70, 229)
    } else if (isEmpty) {
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(255, 255, 255) // invisible spacer
    } else {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(31, 41, 55) // slate-800
    }

    const wrapped = doc.splitTextToSize(line || ' ', maxWidth)
    for (const w of wrapped) {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
      doc.text(w, margin, y)
      y += isEmpty ? 8 : 15
    }
  }

  // Footer with page numbers
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(148, 163, 184) // slate-400
    doc.text(
      `${filename}  ·  Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 30,
      { align: 'center' }
    )
  }

  doc.save(`${sanitizeFilename(filename)}.pdf`)
}

// Strip characters that aren't allowed in filenames
function sanitizeFilename(name) {
  return (name || 'proposal')
    .replace(/[\\/:*?"<>|]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80) || 'proposal'
}