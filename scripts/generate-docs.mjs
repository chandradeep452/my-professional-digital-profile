import fs from 'fs';
import path from 'path';

// Valid PDF buffer generator
function createSimplePdf(title) {
  const streamContent = `BT\n/F1 22 Tf\n50 720 Td\n(${title}) Tj\n/F1 12 Tf\n50 680 Td\n(My Professional Digital Profile - Official Student Document) Tj\n50 660 Td\n(Strict Privacy Policy Compliant - No Phone Number / No Sensitive PII) Tj\nET`;
  const streamLength = Buffer.byteLength(streamContent);

  return `%PDF-1.4
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
<< /Length ${streamLength} >>
stream
${streamContent}
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
0000000227 00000 n 
0000000350 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
420
%%EOF`;
}

const resumesDir = path.join(process.cwd(), 'public', 'uploads', 'resumes');
const certsDir = path.join(process.cwd(), 'public', 'uploads', 'certificates');

if (!fs.existsSync(resumesDir)) fs.mkdirSync(resumesDir, { recursive: true });
if (!fs.existsSync(certsDir)) fs.mkdirSync(certsDir, { recursive: true });

fs.writeFileSync(path.join(resumesDir, 'resume-sample-rushita.pdf'), createSimplePdf('Rushita Jalla - Professional Resume'));
fs.writeFileSync(path.join(resumesDir, 'resume-sample-aanya.pdf'), createSimplePdf('Aanya Sharma - AI/ML Resume'));
fs.writeFileSync(path.join(resumesDir, 'resume-sample-karthik.pdf'), createSimplePdf('Karthik Verma - DevOps Resume'));

fs.writeFileSync(path.join(certsDir, 'cert-aws-cloud.pdf'), createSimplePdf('AWS Certified Cloud Practitioner - Certificate'));
fs.writeFileSync(path.join(certsDir, 'cert-deeplearning.pdf'), createSimplePdf('DeepLearning.AI Deep Learning Specialization'));
fs.writeFileSync(path.join(certsDir, 'cert-meta-frontend.pdf'), createSimplePdf('Meta Professional Front-End Developer Certificate'));

console.log('Sample documents created successfully.');
