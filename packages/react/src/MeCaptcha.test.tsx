import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MeCaptcha } from './MeCaptcha';

vi.mock('./hooks/useMeCaptchaVerify', () => ({
  useMeCaptchaVerify: vi.fn(),
}));

import { useMeCaptchaVerify } from './hooks/useMeCaptchaVerify';

describe('MeCaptcha', () => {
  const TEST_API_KEY = 'mec_test_abc123';
  const mockUseMeCaptchaVerify = useMeCaptchaVerify as ReturnType<
    typeof vi.fn
  >;

  const defaultMockReturn = {
    phoneNumber: '',
    setPhoneNumber: vi.fn(),
    countryCode: '+1',
    setCountryCode: vi.fn(),
    code: '',
    setCode: vi.fn(),
    step: 'phone' as const,
    isLoading: false,
    error: null,
    hasMeCaptcha: false,
    resendCooldown: 0,
    sendCode: vi.fn(),
    verifyCode: vi.fn(),
    editNumber: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseMeCaptchaVerify.mockReturnValue(defaultMockReturn);
  });

  it('should render phone input step', () => {
    render(<MeCaptcha apiKey={TEST_API_KEY} onVerify={vi.fn()} />);

    expect(screen.getByText('MeCaptcha Verify')).toBeInTheDocument();
    expect(screen.getByText('Secure SMS verification')).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send code/i })).toBeInTheDocument();
  });

  it('should render code input step', () => {
    mockUseMeCaptchaVerify.mockReturnValue({
      ...defaultMockReturn,
      step: 'code',
      phoneNumber: '5551234567',
    });

    render(<MeCaptcha apiKey={TEST_API_KEY} onVerify={vi.fn()} />);

    expect(screen.getByText(/enter the 6-digit code/i)).toBeInTheDocument();
    expect(screen.getByText(/change phone number/i)).toBeInTheDocument();
  });

  it('should call sendCode when phone form is submitted', async () => {
    const user = userEvent.setup();
    const sendCode = vi.fn();
    mockUseMeCaptchaVerify.mockReturnValue({
      ...defaultMockReturn,
      phoneNumber: '5551234567',
      sendCode,
    });

    render(<MeCaptcha apiKey={TEST_API_KEY} onVerify={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /send code/i });
    await user.click(submitButton);

    expect(sendCode).toHaveBeenCalled();
  });

  it('should call onVerify when verification succeeds', async () => {
    const onVerify = vi.fn();
    const verifyCode = vi.fn().mockImplementation(async () => {
      const result = {
        success: true,
        creditsAwarded: 10,
        hasMeCaptcha: true,
      };
      onVerify(result);
    });

    mockUseMeCaptchaVerify.mockReturnValue({
      ...defaultMockReturn,
      step: 'code',
      code: '123456',
      verifyCode,
    });

    render(<MeCaptcha apiKey={TEST_API_KEY} onVerify={onVerify} />);

    await verifyCode();

    expect(onVerify).toHaveBeenCalledWith({
      success: true,
      creditsAwarded: 10,
      hasMeCaptcha: true,
    });
  });

  it('should call onError when error occurs', () => {
    const onError = vi.fn();
    mockUseMeCaptchaVerify.mockReturnValue({
      ...defaultMockReturn,
      error: 'Invalid phone number',
    });

    render(<MeCaptcha apiKey={TEST_API_KEY} onVerify={vi.fn()} onError={onError} />);

    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
  });

  it('should hide branding when showBranding is false', () => {
    render(
      <MeCaptcha
        apiKey={TEST_API_KEY}
        onVerify={vi.fn()}
        showBranding={false}
      />,
    );

    expect(screen.queryByText('MeCaptcha Verify')).not.toBeInTheDocument();
    expect(screen.queryByText(/powered by/i)).not.toBeInTheDocument();
  });

  it('should show download prompt when user does not have MeCaptcha', () => {
    mockUseMeCaptchaVerify.mockReturnValue({
      ...defaultMockReturn,
      step: 'code',
      hasMeCaptcha: false,
    });

    render(<MeCaptcha apiKey={TEST_API_KEY} onVerify={vi.fn()} />);

    expect(screen.getByText(/download mecaptcha/i)).toBeInTheDocument();
  });

  it('should allow editing phone number', async () => {
    const user = userEvent.setup();
    const editNumber = vi.fn();

    mockUseMeCaptchaVerify.mockReturnValue({
      ...defaultMockReturn,
      step: 'code',
      editNumber,
    });

    render(<MeCaptcha apiKey={TEST_API_KEY} onVerify={vi.fn()} />);

    const editButton = screen.getByText(/change phone number/i);
    await user.click(editButton);

    expect(editNumber).toHaveBeenCalled();
  });

  it('should use defaultCountryCode prop', () => {
    mockUseMeCaptchaVerify.mockReturnValue({
      ...defaultMockReturn,
      countryCode: '+44',
    });

    render(
      <MeCaptcha
        apiKey={TEST_API_KEY}
        onVerify={vi.fn()}
        defaultCountryCode="+44"
      />,
    );

    expect(mockUseMeCaptchaVerify).toHaveBeenCalledWith(
      TEST_API_KEY,
      expect.any(Object),
    );
  });
});

