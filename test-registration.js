// Test registration API call to match your curl exactly
const testRegistration = async () => {
  const testData = {
    email: "vaibhav@mailinator.com",
    username: "vaibhav",
    first_name: "Vaibhav",
    last_name: "Singh",
    password: "Test@1234"
  };

  console.log('Testing registration with data:', testData);

  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: No Authorization header for registration
      },
      body: JSON.stringify(testData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    const responseData = await response.text();
    console.log('Response body (raw):', responseData);

    if (!response.ok) {
      console.error('Error response');
      return;
    }

    const jsonData = JSON.parse(responseData);
    console.log('Parsed response:', jsonData);

  } catch (error) {
    console.error('Request failed:', error);
  }
};

// Call the test
testRegistration();
