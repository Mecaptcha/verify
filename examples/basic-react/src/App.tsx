import { useState } from 'react';
import { MeCaptcha } from '@mecaptcha/verify-react';
import type { VerifyCodeResult } from '@mecaptcha/verify-sdk';

export default function App() {
  const [result, setResult] = useState<VerifyCodeResult | null>(null);

  const handleVerify = (verifyResult: VerifyCodeResult) => {
    console.log('Verification successful!', verifyResult);
    setResult(verifyResult);
  };

  const handleError = (error: Error) => {
    console.error('Verification error:', error);
    alert(`Error: ${error.message}`);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px' }}>
      {!result ? (
        <div>
          <h1 style={{ textAlign: 'center', marginBottom: '32px' }}>
            MeCaptcha Verify - Basic Example
          </h1>
          
          <MeCaptcha
            apiKey="mec_test_abc123"
            onVerify={handleVerify}
            onError={handleError}
          />
          
          <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Test Credentials:</h3>
            <p style={{ margin: '0', fontSize: '13px', color: '#6b7280' }}>
              API Key: <code>mec_test_abc123</code><br/>
              Phone: <code>+12489794474</code><br/>
              Use any code sent to your phone
            </p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ margin: '0 0 16px 0' }}>Verification Successful!</h2>
          
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'left' }}>
            <p style={{ margin: '0 0 8px 0' }}>
              <strong>Credits Awarded:</strong> {result.creditsAwarded}
            </p>
            <p style={{ margin: '0' }}>
              <strong>Has MeCaptcha Account:</strong> {result.hasMeCaptcha ? 'Yes 🎉' : 'No'}
            </p>
          </div>
          
          {!result.hasMeCaptcha && (
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                Download MeCaptcha to start earning credits with every verification!
              </p>
            </div>
          )}
          
          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Verify Another Number
          </button>
        </div>
      )}
    </div>
  );
}



