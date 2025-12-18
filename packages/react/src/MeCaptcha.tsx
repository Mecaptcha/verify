import { useMeCaptchaVerify } from "./hooks/useMeCaptchaVerify";
import { PhoneInput } from "./components/PhoneInput";
import { CodeInput } from "./components/CodeInput";
import { DownloadPrompt } from "./components/DownloadPrompt";
import type { MeCaptchaProps } from "./types";
import { colors } from "./theme";
import { useState } from "react";

export function MeCaptcha({
  apiKey,
  onVerify,
  onError,
  defaultCountryCode = "+1",
  showBranding = true,
}: MeCaptchaProps) {
  const [theme] = useState<"light" | "dark">(
    () =>
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light",
  );
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
  } = useMeCaptchaVerify(apiKey, { onVerify, onError });

  const isPhoneValid = phoneNumber.length === 10;
  const isCodeValid = code.length === 6;

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
      {showBranding && (
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: 700,
              color: themeColors.primary,
            }}
          >
            MeCaptcha Verify
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: themeColors.textSecondary,
            }}
          >
            Secure SMS verification
          </p>
        </div>
      )}

      {step === "phone" ? (
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
            onSubmit={() => verifyCode()}
            onResend={sendCode}
            phoneNumber={phoneNumber}
            isLoading={isLoading}
            error={error || undefined}
            resendCooldown={resendCooldown}
          />

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
              margin: 0,
              fontSize: "12px",
              color: themeColors.textSecondary,
            }}
          >
            Powered by{" "}
            <a
              href="https://mecaptcha.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: themeColors.primary,
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              MeCaptcha
            </a>
          </p>
        </div>
      )}
    </div>
  );
}



