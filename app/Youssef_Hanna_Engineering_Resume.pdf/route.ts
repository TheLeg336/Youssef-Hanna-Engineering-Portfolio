import { NextResponse } from 'next/server';

export async function GET() {
  const pdfString = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 260 >>
stream
BT
/F1 20 Tf
50 720 Td
(YOUSSEF HANNA - ENGINEERING RESUME) Tj
0 -30 Td
/F1 11 Tf
(Cal Poly Pomona - Junior - B.S. Mechanical Engineering - GPA 3.74 / 4.00) Tj
0 -20 Td
(Seeking Summer 2027 Engineering Internships) Tj
0 -20 Td
(Email: youssefhanna336@gmail.com | GitHub: github.com/TheLeg336) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000244 00000 n 
0000000556 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
625
%%EOF`;

  return new NextResponse(pdfString, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="Youssef_Hanna_Engineering_Resume.pdf"',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
