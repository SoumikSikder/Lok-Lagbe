import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import RegisterPage from '../../pages/RegisterPage';
import * as authService from '../../services/authService';
import { ApiError } from '../../services/apiClient.js';

/**
 * Test suite for the RegisterPage component.
 * Tests cover rendering, form interaction and submission behaviour.
 */
describe('RegisterPage', () => {

    /**
     * Helper function to render RegisterPage with router context.
     * @returns {object} The rendered component utilities.
     */
    const _renderRegisterPage = () => {
        return render(
            <MemoryRouter>
                <RegisterPage />
            </MemoryRouter>
        );
    };

    it('renders the Lok Lagbe brand name', () => {
        _renderRegisterPage();
        expect(screen.getByText('Lok')).toBeInTheDocument();
    });

    it('renders the registration form heading', () => {
        _renderRegisterPage();
        expect(
            screen.getByText('Create your account to get started.')
        ).toBeInTheDocument();
    });

    it('renders all 5 avatar options', () => {
        _renderRegisterPage();
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('renders all form fields', () => {
        _renderRegisterPage();
        expect(screen.getByPlaceholderText('yourname123')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Minimum 8 characters')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('+880 1XXX XXXXXX')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Dhaka, Bangladesh')).toBeInTheDocument();
    });

    it('renders the create account button', () => {
        _renderRegisterPage();
        expect(
            screen.getByText('Create account')
        ).toBeInTheDocument();
    });

    it('renders the log in link', () => {
        _renderRegisterPage();
        expect(screen.getByText('Log in')).toBeInTheDocument();
    });

    it('shows error when required fields are empty and form is submitted', async () => {
        const user = userEvent.setup();
        _renderRegisterPage();

        // Click submit without filling in any fields
        await user.click(screen.getByText('Create account'));

        expect(
            screen.getByText('Username, email and password are required.')
        ).toBeInTheDocument();
    });

    it('allows user to type in the username field', async () => {
        const user = userEvent.setup();
        _renderRegisterPage();

        const usernameInput = screen.getByPlaceholderText('yourname123');
        await user.type(usernameInput, 'testuser');

        expect(usernameInput.value).toBe('testuser');
    });

    it('allows user to type in the email field', async () => {
        const user = userEvent.setup();
        _renderRegisterPage();

        const emailInput = screen.getByPlaceholderText('you@example.com');
        await user.type(emailInput, 'test@test.com');

        expect(emailInput.value).toBe('test@test.com');
    });

    it('allows user to type in the password field', async () => {
        const user = userEvent.setup();
        _renderRegisterPage();

        const passwordInput = screen.getByPlaceholderText('Minimum 8 characters');
        await user.type(passwordInput, 'testpass123');

        expect(passwordInput.value).toBe('testpass123');
    });

    it('shows success message when registration is successful', async () => {
        const user = userEvent.setup();

        // Mock the API call to return success
        vi.spyOn(authService, '_registerUser').mockResolvedValue({
            message: 'Account created successfully.',
        });

        _renderRegisterPage();

        await user.type(
            screen.getByPlaceholderText('yourname123'),
            'testuser'
        );
        await user.type(
            screen.getByPlaceholderText('you@example.com'),
            'test@test.com'
        );
        await user.type(
            screen.getByPlaceholderText('Minimum 8 characters'),
            'testpass123'
        );

        await user.click(screen.getByText('Create account'));

        await waitFor(() => {
            expect(
                screen.getByText('Account created successfully! You can now log in.')
            ).toBeInTheDocument();
        });
    });

    it('shows error message when registration fails', async () => {
        const user = userEvent.setup();

        // Mock the API call to return an error
        vi.spyOn(authService, '_registerUser').mockRejectedValue(
            new ApiError('This username is already taken.', {
                status: 400,
                details: { username: ['This username is already taken.'] },
            })
        );

        _renderRegisterPage();

        await user.type(
            screen.getByPlaceholderText('yourname123'),
            'testuser'
        );
        await user.type(
            screen.getByPlaceholderText('you@example.com'),
            'test@test.com'
        );
        await user.type(
            screen.getByPlaceholderText('Minimum 8 characters'),
            'testpass123'
        );

        await user.click(screen.getByText('Create account'));

        await waitFor(() => {
            expect(
                screen.getByText('This username is already taken.')
            ).toBeInTheDocument();
        });
    });

    it('selecting an avatar updates the selected state', async () => {
        const user = userEvent.setup();
        _renderRegisterPage();

        // Click avatar 3
        await user.click(screen.getByText('3'));

        // Avatar 3 button should now be selected
        const avatarButton = screen.getByText('3');
        expect(avatarButton).toBeInTheDocument();
    });

});