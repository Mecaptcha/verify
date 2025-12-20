import { useState } from 'react';
import { MeCaptcha, useMeCaptchaRef } from '@mecaptcha/verify-react';
import type { VerifyCodeResult } from '@mecaptcha/verify-sdk';

export default function App() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<VerifyCodeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { ref, isValidPhone, sendCode } = useMeCaptchaRef({
    phoneNumber,
    countryCode: '+1',
  });

  const handleVerify = (verifyResult: VerifyCodeResult) => {
    console.log('Verification successful!', verifyResult);
    setResult(verifyResult);
  };

  const handleError = (err: Error) => {
    console.error('Verification error:', err);
    setError(err.message);
  };

  const handleSendCode = async () => {
    if (!isValidPhone) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    try {
      setError(null);
      await sendCode();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code');
    }
  };

  const handleReset = () => {
    setResult(null);
    setPhoneNumber('');
    setError(null);
  };

  if (result) {
    return (
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '32px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ margin: '0 0 16px 0', color: '#111827', fontSize: '24px', fontWeight: 700 }}>
            Verification Successful!
          </h2>
          
          <div style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f3f4f6', borderRadius: '8px', textAlign: 'left' }}>
            <p style={{ margin: '0 0 8px 0', color: '#111827' }}>
              <strong style={{ color: '#111827' }}>Credits Awarded:</strong> {result.creditsAwarded}
            </p>
            <p style={{ margin: '0', color: '#111827' }}>
              <strong style={{ color: '#111827' }}>Has MeCaptcha Account:</strong> {result.hasMeCaptcha ? 'Yes 🎉' : 'No'}
            </p>
          </div>
          
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
      </div>
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '32px', color: '#111827', fontSize: '28px', fontWeight: 700 }}>
        MeCaptcha Verify - External Phone Example
      </h1>

      <div style={{ marginBottom: '24px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#111827', fontWeight: 600 }}>
          External Phone Input
        </h3>
        <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#111827' }}>
          This example shows how to use MeCaptcha with an external phone number input.
          The phone number is collected outside the MeCaptcha component, and MeCaptcha
          only handles sending the code and verification.
        </p>
        
        <div style={{ marginBottom: '16px' }}>
          <label
            htmlFor="external-phone"
            style={{
              display: 'block',
              marginBottom: '8px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#111827',
            }}
          >
            Phone Number (10 digits)
          </label>
          <input
            id="external-phone"
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '').slice(0, 10);
              setPhoneNumber(cleaned);
              setError(null);
            }}
            placeholder="8025551212"
            style={{
              width: '100%',
              padding: '12px',
              border: `1px solid ${error ? '#ef4444' : '#e5e7eb'}`,
              borderRadius: '8px',
              fontSize: '16px',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              outline: 'none',
            }}
          />
          {error && (
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#ef4444' }}>
              {error}
            </p>
          )}
        </div>

        <button
          onClick={handleSendCode}
          disabled={!isValidPhone}
          style={{
            width: '100%',
            padding: '12px 24px',
            backgroundColor: isValidPhone ? '#15099a' : '#e5e7eb',
            color: isValidPhone ? '#ffffff' : '#6b7280',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: isValidPhone ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s',
          }}
        >
          Send Verification Code
        </button>
      </div>

      {/* MeCaptcha component - only shows code input when phone is provided */}
      {phoneNumber && (
        <MeCaptcha
          ref={ref}
          apiKey="demo"
          phoneNumber={phoneNumber}
          countryCode="+1"
          onVerify={handleVerify}
          onError={handleError}
        />
      )}

      <div style={{ marginTop: '32px', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#111827', fontWeight: 600 }}>Demo Credentials:</h3>
        <p style={{ margin: '0', fontSize: '13px', color: '#111827' }}>
          API Key: <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: '#111827' }}>demo</code><br/>
          Phone: <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: '#111827' }}>8025551212</code> (or <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: '#111827' }}>+18025551212</code>)<br/>
          Code: <code style={{ backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px', color: '#111827' }}>123456</code>
        </p>
      </div>
    </div>
  );
}

