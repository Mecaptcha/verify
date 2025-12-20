import { useMeCaptchaVerify } from "./hooks/useMeCaptchaVerify";
import { PhoneInput } from "./components/PhoneInput";
import { CodeInput } from "./components/CodeInput";
import { DownloadPrompt } from "./components/DownloadPrompt";
import type { MeCaptchaProps, MeCaptchaHandle } from "./types";
import { colors } from "./theme";
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

export const MeCaptcha = forwardRef<MeCaptchaHandle, MeCaptchaProps>(function MeCaptcha(
  {
    apiKey,
    onVerify,
    onError,
    defaultCountryCode = "+1",
    showBranding = true,
    baseUrl,
    phoneNumber: externalPhoneNumber,
    countryCode: externalCountryCode,
  },
  ref,
) {
  const [theme] = useState<"light" | "dark">(() => "light");
  const themeColors = colors[theme];

  const {
    phoneNumber,
    setPhoneNumber,
    countryCode,
    setCountryCode,
    code,
    setCode,
    step,
    isLoading,
    error,
    hasMeCaptcha,
    resendCooldown,
    sendCode,
    verifyCode,
    editNumber,
  } = useMeCaptchaVerify(apiKey, {
    onVerify,
    onError,
    baseUrl,
    initialPhoneNumber: externalPhoneNumber,
    initialCountryCode: externalCountryCode || defaultCountryCode,
  });

  // Expose imperative handle for ref
  useImperativeHandle(ref, () => ({
    sendCode,
    verifyCode: (codeValue: string) => verifyCode(codeValue),
  }));

  useEffect(() => {
    if (countryCode === "+1" && defaultCountryCode !== "+1") {
      setCountryCode(defaultCountryCode);
    }
  }, [defaultCountryCode, countryCode, setCountryCode]);

  const isPhoneValid = phoneNumber.length === 10;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "24px",
        backgroundColor: themeColors.background,
        color: themeColors.text,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {step === "phone" && !externalPhoneNumber ? (
        <PhoneInput
          value={phoneNumber}
          onChange={setPhoneNumber}
          countryCode={countryCode}
          onCountryCodeChange={setCountryCode}
          onSubmit={sendCode}
          isLoading={isLoading}
          isValid={isPhoneValid}
          error={error || undefined}
        />
      ) : (
        <>
          <CodeInput
            value={code}
            onChange={setCode}
            onSubmit={(codeValue) => verifyCode(codeValue)}
            onResend={sendCode}
            phoneNumber={phoneNumber}
            isLoading={isLoading}
            error={error || undefined}
            resendCooldown={resendCooldown}
          />

          {!externalPhoneNumber && (
            <button
              type="button"
              onClick={editNumber}
              style={{
                marginTop: "16px",
                background: "none",
                border: "none",
                color: themeColors.primary,
                fontSize: "14px",
                cursor: "pointer",
                textDecoration: "underline",
                width: "100%",
              }}
            >
              Change phone number
            </button>
          )}

          <DownloadPrompt show={!hasMeCaptcha} />
        </>
      )}

      {showBranding && (
        <div
          style={{
            marginTop: "24px",
            paddingTop: "16px",
            borderTop: `1px solid ${themeColors.border}`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: "0 0 8px 0",
              fontSize: "12px",
              color: themeColors.textSecondary,
            }}
          >
            Powered by
          </p>
          <a
            href="https://mecaptcha.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              textDecoration: "none",
            }}
          >
            <img
              src="https://www.mecaptcha.com/assets/wordmark.svg"
              alt="MeCaptcha"
              style={{
                height: "20px",
                width: "auto",
              }}
            />
          </a>
        </div>
      )}
    </div>
  );
});
