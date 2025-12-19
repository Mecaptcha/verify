import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CodeInput } from './CodeInput';

describe('CodeInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    onSubmit: vi.fn(),
    onResend: vi.fn(),
    phoneNumber: '5551234567',
    isLoading: false,
    resendCooldown: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render code input with 6 digits', () => {
    render(<CodeInput {...defaultProps} />);

    const inputs = screen.getAllByRole('textbox');
    expect(inputs).toHaveLength(6);
  });

  it('should display phone number', () => {
    render(<CodeInput {...defaultProps} phoneNumber="5551234567" />);

    expect(screen.getByText(/555.*123.*4567/i)).toBeInTheDocument();
  });

  it('should allow typing code digit by digit', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<CodeInput {...defaultProps} onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');

    await user.type(inputs[0], '1');
    await waitFor(() => {
      expect(onChange).toHaveBeenCalled();
    });

    await user.type(inputs[1], '2');
    await waitFor(() => {
      expect(onChange.mock.calls.length).toBeGreaterThan(1);
    });
  });

  it('should auto-submit when 6 digits are entered', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<CodeInput {...defaultProps} onSubmit={onSubmit} />);

    const inputs = screen.getAllByRole('textbox');

    for (let i = 0; i < 6; i++) {
      await user.type(inputs[i], String(i + 1));
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    await waitFor(
      () => {
        expect(onSubmit).toHaveBeenCalledWith('123456');
      },
      { timeout: 2000 },
    );
  });

  it('should handle paste of 6-digit code', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <CodeInput
        {...defaultProps}
        onChange={onChange}
        onSubmit={onSubmit}
      />,
    );

    const firstInput = screen.getAllByRole('textbox')[0];
    await user.click(firstInput);
    await user.paste('123456');

    expect(onChange).toHaveBeenCalledWith('123456');

    await waitFor(
      () => {
        expect(onSubmit).toHaveBeenCalledWith('123456');
      },
      { timeout: 2000 },
    );
  });

  it('should handle backspace to move to previous input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<CodeInput {...defaultProps} value="123" onChange={onChange} />);

    const inputs = screen.getAllByRole('textbox');
    await user.click(inputs[2]);
    await user.keyboard('{Backspace}');
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(inputs[1]).toHaveFocus();
  });

  it('should call onResend when resend button is clicked', async () => {
    const user = userEvent.setup();
    const onResend = vi.fn();

    render(<CodeInput {...defaultProps} onResend={onResend} />);

    const resendButton = screen.getByText(/resend code/i);
    await user.click(resendButton);

    expect(onResend).toHaveBeenCalled();
  });

  it('should disable resend button during cooldown', () => {
    render(<CodeInput {...defaultProps} resendCooldown={30} />);

    const resendButton = screen.getByText(/resend code in 30s/i);
    expect(resendButton).toBeDisabled();
  });

  it('should show error message', () => {
    render(<CodeInput {...defaultProps} error="Invalid code" />);

    expect(screen.getByText('Invalid code')).toBeInTheDocument();
  });

  it('should disable inputs when loading', () => {
    render(<CodeInput {...defaultProps} isLoading={true} />);

    const inputs = screen.getAllByRole('textbox');
    inputs.forEach((input) => {
      expect(input).toBeDisabled();
    });
  });

  it('should format phone number correctly', () => {
    render(<CodeInput {...defaultProps} phoneNumber="5551234567" />);

    expect(screen.getByText(/555.*123.*4567/i)).toBeInTheDocument();
  });
});

