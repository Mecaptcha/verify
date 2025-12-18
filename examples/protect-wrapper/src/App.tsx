import { MeCaptchaProtect, useMeCaptchaContext } from '@mecaptcha/verify-react';

function ProtectedContent() {
  const { verificationResult } = useMeCaptchaContext();

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '600px',
      padding: '32px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
        <h1 style={{ margin: '0 0 8px 0' }}>Welcome!</h1>
        <p style={{ margin: 0, color: '#6b7280' }}>
          You're now accessing protected content
        </p>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Verification Details:</h3>
        
        {verificationResult && (
          <>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
              <strong>Credits Earned:</strong>{' '}
              <span style={{ color: '#059669', fontWeight: 600 }}>
                {verificationResult.creditsAwarded} humanity credits
              </span>
            </p>
            
            <p style={{ margin: 0, fontSize: '14px' }}>
              <strong>MeCaptcha Account:</strong>{' '}
              {verificationResult.hasMeCaptcha ? '✅ Yes' : '❌ No'}
            </p>
            
            {!verificationResult.hasMeCaptcha && (
              <p style={{ 
                margin: '12px 0 0 0', 
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                fontSize: '13px'
              }}>
                💡 Download MeCaptcha to start earning credits!
              </p>
            )}
          </>
        )}
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px' }}>Protected Features:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li style={{ marginBottom: '8px' }}>Access to premium content</li>
          <li style={{ marginBottom: '8px' }}>Secure transactions</li>
          <li style={{ marginBottom: '8px' }}>Account management</li>
          <li>Advanced settings</li>
        </ul>
      </div>
      
      <button
        onClick={() => {
          sessionStorage.clear();
          window.location.reload();
        }}
        style={{
          marginTop: '24px',
          width: '100%',
          padding: '12px',
          backgroundColor: '#ef4444',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Sign Out
      </button>
    </div>
  );
}

export default function App() {
  return (
    <MeCaptchaProtect 
      apiKey="mec_test_abc123"
      onVerified={(result) => {
        console.log('User verified!', result);
      }}
    >
      <ProtectedContent />
    </MeCaptchaProtect>
  );
}



