import { useState } from "react";
import type { PhoneInputProps } from "../types";
import { colors } from "../theme";

export function PhoneInput({
  value,
  onChange,
  countryCode,
  onCountryCodeChange,
  onSubmit,
  isLoading,
  isValid,
  error,
}: PhoneInputProps) {
  const [theme] = useState<"light" | "dark">(() => "light");
  const themeColors = colors[theme];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleaned = e.target.value.replace(/\D/g, "");
    onChange(cleaned);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && isValid && !isLoading) {
      onSubmit();
    }
  };

  const formatPhoneDisplay = (phone: string) => {
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  return (
    <div style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
      <label
        htmlFor="phone-input"
        style={{
          display: "block",
          marginBottom: "8px",
          fontSize: "14px",
          fontWeight: 500,
          color: themeColors.text,
        }}
      >
        Phone Number
      </label>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <select
          value={countryCode}
          onChange={(e) => onCountryCodeChange(e.target.value)}
          disabled={isLoading}
          style={{
            padding: "12px",
            border: `1px solid ${themeColors.border}`,
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            color: themeColors.text,
            fontSize: "16px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            cursor: "pointer",
            outline: "none",
          }}
        >
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+91">🇮🇳 +91</option>
          <option value="+86">🇨🇳 +86</option>
          <option value="+81">🇯🇵 +81</option>
        </select>

        <input
          id="phone-input"
          type="tel"
          value={formatPhoneDisplay(value)}
          onChange={handlePhoneChange}
          onKeyDown={handleKeyDown}
          placeholder="(555) 123-4567"
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "12px",
            border: `1px solid ${error ? themeColors.error : themeColors.border}`,
            borderRadius: "8px",
            backgroundColor: "#ffffff",
            color: themeColors.text,
            fontSize: "16px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            outline: "none",
          }}
        />
      </div>

      {error && (
        <p
          style={{
            margin: "0 0 12px 0",
            fontSize: "14px",
            color: themeColors.error,
          }}
        >
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={onSubmit}
        disabled={!isValid || isLoading}
        style={{
          width: "100%",
          padding: "12px 24px",
          backgroundColor: isValid && !isLoading ? themeColors.primary : themeColors.border,
          color: isValid && !isLoading ? "#ffffff" : themeColors.textSecondary,
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: 600,
          cursor: isValid && !isLoading ? "pointer" : "not-allowed",
          transition: "background-color 0.2s",
        }}
        onMouseEnter={(e) => {
          if (isValid && !isLoading) {
            e.currentTarget.style.backgroundColor = themeColors.primaryHover;
          }
        }}
        onMouseLeave={(e) => {
          if (isValid && !isLoading) {
            e.currentTarget.style.backgroundColor = themeColors.primary;
          }
        }}
      >
        {isLoading ? "Sending..." : "Send Code"}
      </button>
    </div>
  );
}



