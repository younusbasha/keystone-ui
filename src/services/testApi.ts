// Simple script to test API connectivity
async function testApiConnectivity() {
  console.log('=== API Connectivity Test ===');
  
  // Test 1: Direct API call to localhost:8000
  console.log('\n1. Testing direct API call to localhost:8000...');
  try {
    const directResponse = await fetch('http://localhost:8000/api/v1/auth/register', {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    });
    console.log('✅ Direct API call status:', directResponse.status);
    console.log('Direct API headers:', Object.fromEntries(directResponse.headers.entries()));
  } catch (error) {
    console.log('❌ Direct API call failed:', error instanceof Error ? error.message : String(error));
  }

  // Test 2: Proxy API call
  console.log('\n2. Testing proxy API call...');
  try {
    const proxyResponse = await fetch('/api/v1/auth/register', {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('✅ Proxy API call status:', proxyResponse.status);
    console.log('Proxy API headers:', Object.fromEntries(proxyResponse.headers.entries()));
  } catch (error) {
    console.log('❌ Proxy API call failed:', error instanceof Error ? error.message : String(error));
  }

  // Test 3: Test POST request via proxy
  console.log('\n3. Testing POST request via proxy...');
  try {
    const testData = {
      email: "test@example.com",
      username: "testuser123",
      first_name: "Test",
      last_name: "User",
      password: "testpass123"
    };

    const postResponse = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('✅ POST request status:', postResponse.status);
    console.log('POST response headers:', Object.fromEntries(postResponse.headers.entries()));
    
    const responseData = await postResponse.json().catch(() => 'Could not parse JSON');
    console.log('POST response data:', responseData);
  } catch (error) {
    console.log('❌ POST request failed:', error instanceof Error ? error.message : String(error));
  }
}

// Export for browser console
(globalThis as any).testApiConnectivity = testApiConnectivity;

console.log('API connectivity test function available as window.testApiConnectivity()');
export default testApiConnectivity;
