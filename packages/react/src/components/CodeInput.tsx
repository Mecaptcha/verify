import { useEffect, useRef, useState } from "react";
import type { CodeInputProps } from "../types";
import { colors } from "../theme";

export function CodeInput({
  value,
  onChange,
  onSubmit,
  onResend,
  phoneNumber,
  isLoading,
  error,
  resendCooldown,
}: CodeInputProps) {
  const [theme] = useState<"light" | "dark">(() => "light");
  const themeColors = colors[theme];
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("");

  useEffect(() => {
    if (value.length === 0 && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [value.length]);

  const handleChange = (index: number, digit: string) => {
    const cleaned = digit.replace(/\D/g, "");
    if (cleaned.length === 0) {
      const newValue = digits.filter((_, i) => i !== index).join("");
      onChange(newValue);
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1]?.focus();
      }
      return;
    }

    if (cleaned.length === 1) {
      const newDigits = [...digits];
      newDigits[index] = cleaned;
      const newValue = newDigits.join("");
      onChange(newValue);

      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
      }

      if (newValue.length === 6) {
        setTimeout(() => onSubmit(newValue), 150);
      }
    } else if (cleaned.length === 6) {
      onChange(cleaned);
      setTimeout(() => onSubmit(cleaned), 150);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const cleaned = pastedData.replace(/\D/g, "").slice(0, 6);
    if (cleaned.length > 0) {
      onChange(cleaned);
      if (cleaned.length === 6) {
        setTimeout(() => onSubmit(cleaned), 150);
      }
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (phone.length === 10) {
      return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      <p
        style={{
          marginBottom: "24px",
          fontSize: "14px",
          color: themeColors.textSecondary,
          textAlign: "center",
        }}
      >
        Enter the 6-digit code sent to{" "}
        <strong style={{ color: themeColors.text }}>
          {formatPhoneNumber(phoneNumber)}
        </strong>
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: "center",
          marginBottom: "16px",
        }}
      >
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={digits[index] || ""}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isLoading}
            style={{
              width: "48px",
              height: "56px",
              textAlign: "center",
              fontSize: "24px",
              fontWeight: 600,
              border: `2px solid ${error ? themeColors.error : themeColors.border}`,
              borderRadius: "8px",
              backgroundColor: themeColors.surface,
              color: themeColors.text,
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = themeColors.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = error ? themeColors.error : themeColors.border;
            }}
          />
        ))}
      </div>

      {error && (
        <p
          style={{
            margin: "0 0 16px 0",
            fontSize: "14px",
            color: themeColors.error,
            textAlign: "center",
          }}
        >
          {error}
        </p>
      )}

      <div style={{ textAlign: "center" }}>
        <button
          type="button"
          onClick={onResend}
          disabled={resendCooldown > 0 || isLoading}
          style={{
            background: "none",
            border: "none",
            color: resendCooldown > 0 ? themeColors.textSecondary : themeColors.primary,
            fontSize: "14px",
            cursor: resendCooldown > 0 ? "not-allowed" : "pointer",
            padding: "8px",
            textDecoration: "underline",
          }}
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Resend code"}
        </button>
      </div>
    </div>
  );
}



