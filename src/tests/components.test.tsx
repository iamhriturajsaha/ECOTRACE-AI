import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UpdateProfileForm } from '../features/dashboard/UpdateProfileForm';
import { updateProfile } from '../app/actions/settings';

// Mock the action
vi.mock('../app/actions/settings', () => ({
  updateProfile: vi.fn(),
}));

describe('UpdateProfileForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input elements with correct initial values', () => {
    render(<UpdateProfileForm initialName="Alice" initialEmail="alice@example.com" />);
    
    const nameInput = screen.getByLabelText(/Display Name/i) as HTMLInputElement;
    const emailInput = screen.getByLabelText(/Email Address/i) as HTMLInputElement;

    expect(nameInput.value).toBe('Alice');
    expect(emailInput.value).toBe('alice@example.com');
    expect(emailInput).toBeDisabled();
  });

  it('shows error state when action fails', async () => {
    vi.mocked(updateProfile).mockRejectedValue(new Error('Invalid name format'));

    render(<UpdateProfileForm initialName="Alice" initialEmail="alice@example.com" />);
    
    const nameInput = screen.getByLabelText(/Display Name/i);
    fireEvent.change(nameInput, { target: { value: 'Bob' } });

    const submitBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(submitBtn);

    const alertBox = await screen.findByRole('alert');
    expect(alertBox).toBeInTheDocument();
    expect(alertBox.textContent).toContain('Invalid name format');
  });
});
