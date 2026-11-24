async function runTest() {
  const payloadWithPhone = {
    studentId: 'TEST999',
    fullName: 'Test Candidate',
    institutionalEmail: 'test@college.edu',
    degree: 'B.Tech',
    branch: 'Computer Science',
    graduationYear: 2026,
    cgpa: 8.5,
    headlineBio: 'Passionate developer, phone number: 9876543210',
    skills: [],
    projects: [],
    certificates: [],
  };

  console.log('--- Testing Privacy Check (Rejecting Phone Numbers) ---');
  const res = await fetch('http://localhost:3000/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payloadWithPhone),
  });

  const data = await res.json();
  console.log('Status code:', res.status);
  console.log('Response:', data);

  if (res.status === 400 && data.error && data.error.includes('Phone numbers')) {
    console.log('PASS: Phone number was correctly rejected with 400 Bad Request!');
  } else {
    console.error('FAIL: Expected rejection of phone number.');
  }
}

runTest();
