
import { PDFDocument } from "pdfkit";

export const generateResumePDF = (resumeText, res) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50
  });

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="tailored-resume.pdf"'
  );

  doc.pipe(res);

  doc
    .font("Helvetica")
    .fontSize(11)
    .text(resumeText, {
      align: "left",
      lineGap: 5
    });

  doc.end();
};
