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
          <h1 style={{ textAlign: 'center', marginBottom: '32px', color: '#111827', fontSize: '28px', fontWeight: 700 }}>
            MeCaptcha Verify - Basic Example
          </h1>
          
          <MeCaptcha
            apiKey="demo"
            onVerify={handleVerify}
            onError={handleError}
          />
          
          <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#111827', fontWeight: 600 }}>Demo Credentials:</h3>
            <p style={{ margin: '0', fontSize: '13px', color: '#111827' }}>
              API Key: <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: '#111827' }}>demo</code><br/>
              Phone: <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: '#111827' }}>+18025551212</code><br/>
              Code: <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: '#111827' }}>123456</code>
            </p>
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ margin: '0 0 16px 0', color: '#111827', fontSize: '24px', fontWeight: 700 }}>Verification Successful!</h2>
          
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'left' }}>
            <p style={{ margin: '0 0 8px 0', color: '#111827' }}>
              <strong style={{ color: '#111827' }}>Credits Awarded:</strong> {result.creditsAwarded}
            </p>
            <p style={{ margin: '0', color: '#111827' }}>
              <strong style={{ color: '#111827' }}>Has MeCaptcha Account:</strong> {result.hasMeCaptcha ? 'Yes 🎉' : 'No'}
            </p>
          </div>
          
          {!result.hasMeCaptcha && (
            <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
                Download MeCaptcha to start earning credits with every verification!
              </p>
            </div>
          )}
          
          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              backgroundColor: '#15099a',
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



