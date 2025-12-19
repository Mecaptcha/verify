import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneInput } from './PhoneInput';

describe('PhoneInput', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    countryCode: '+1',
    onCountryCodeChange: vi.fn(),
    onSubmit: vi.fn(),
    isLoading: false,
    isValid: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render phone input', () => {
    render(<PhoneInput {...defaultProps} />);

    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send code/i })).toBeInTheDocument();
  });

  it('should format phone number display', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<PhoneInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByLabelText(/phone number/i);
    await user.clear(input);
    await user.type(input, '5551234567', { skipClick: false });

    const calls = onChange.mock.calls;
    expect(calls.some((call) => call[0] === '5551234567')).toBe(true);
  });

  it('should only allow numeric input', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<PhoneInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByLabelText(/phone number/i);
    await user.clear(input);
    await user.type(input, 'abc555def123', { skipClick: false });

    const calls = onChange.mock.calls.map((call) => call[0]);
    expect(calls.some((call) => call.includes('555') && call.includes('123'))).toBe(
      true,
    );
  });

  it('should call onSubmit when Enter is pressed and valid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<PhoneInput {...defaultProps} isValid={true} onSubmit={onSubmit} />);

    const input = screen.getByLabelText(/phone number/i);
    await user.type(input, '5551234567');
    await user.keyboard('{Enter}');

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should not call onSubmit when Enter is pressed and invalid', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<PhoneInput {...defaultProps} isValid={false} onSubmit={onSubmit} />);

    const input = screen.getByLabelText(/phone number/i);
    await user.type(input, '555');
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit when button is clicked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<PhoneInput {...defaultProps} isValid={true} onSubmit={onSubmit} />);

    const button = screen.getByRole('button', { name: /send code/i });
    await user.click(button);

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should disable button when invalid', () => {
    render(<PhoneInput {...defaultProps} isValid={false} />);

    const button = screen.getByRole('button', { name: /send code/i });
    expect(button).toBeDisabled();
  });

  it('should disable button when loading', () => {
    render(<PhoneInput {...defaultProps} isValid={true} isLoading={true} />);

    const button = screen.getByRole('button', { name: /sending/i });
    expect(button).toBeDisabled();
  });

  it('should show error message', () => {
    render(<PhoneInput {...defaultProps} error="Invalid phone number" />);

    expect(screen.getByText('Invalid phone number')).toBeInTheDocument();
  });

  it('should allow changing country code', async () => {
    const user = userEvent.setup();
    const onCountryCodeChange = vi.fn();

    render(
      <PhoneInput
        {...defaultProps}
        onCountryCodeChange={onCountryCodeChange}
      />,
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, '+44');

    expect(onCountryCodeChange).toHaveBeenCalledWith('+44');
  });

  it('should disable inputs when loading', () => {
    render(<PhoneInput {...defaultProps} isLoading={true} />);

    const input = screen.getByLabelText(/phone number/i);
    const select = screen.getByRole('combobox');
    const button = screen.getByRole('button');

    expect(input).toBeDisabled();
    expect(select).toBeDisabled();
    expect(button).toBeDisabled();
  });
});

