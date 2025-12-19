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
        <h1 style={{ margin: '0 0 8px 0', color: '#111827', fontSize: '28px', fontWeight: 700 }}>Welcome!</h1>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '16px' }}>
          You're now accessing protected content
        </p>
      </div>

      <div style={{
        padding: '20px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        marginBottom: '24px'
      }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#111827', fontWeight: 600 }}>Verification Details:</h3>
        
        {verificationResult && (
          <>
            <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#111827' }}>
              <strong style={{ color: '#111827' }}>Credits Earned:</strong>{' '}
              <span style={{ color: '#059669', fontWeight: 600 }}>
                {verificationResult.creditsAwarded} humanity credits
              </span>
            </p>
            
            <p style={{ margin: 0, fontSize: '14px', color: '#111827' }}>
              <strong style={{ color: '#111827' }}>MeCaptcha Account:</strong>{' '}
              {verificationResult.hasMeCaptcha ? '✅ Yes' : '❌ No'}
            </p>
            
            {!verificationResult.hasMeCaptcha && (
              <p style={{ 
                margin: '12px 0 0 0', 
                padding: '12px',
                backgroundColor: '#fef3c7',
                borderRadius: '6px',
                fontSize: '13px',
                color: '#92400e'
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
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#111827', fontWeight: 600 }}>Protected Features:</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#111827' }}>
          <li style={{ marginBottom: '8px', color: '#111827' }}>Access to premium content</li>
          <li style={{ marginBottom: '8px', color: '#111827' }}>Secure transactions</li>
          <li style={{ marginBottom: '8px', color: '#111827' }}>Account management</li>
          <li style={{ color: '#111827' }}>Advanced settings</li>
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
      apiKey="demo"
      onVerified={(result) => {
        console.log('User verified!', result);
      }}
      onError={(error) => {
        console.error('MeCaptcha error:', error);
        alert(`Verification error: ${error.message}`);
      }}
    >
      <ProtectedContent />
    </MeCaptchaProtect>
  );
}



