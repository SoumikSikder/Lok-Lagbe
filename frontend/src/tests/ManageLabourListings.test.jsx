import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import ManageLabourListings from '../Admin UI/Manage Labour Listing/ManageLabourListings';

const MOCK_LISTINGS = [
    {
        id: 1,
        name: 'Rahim Ahmed',
        email: 'rahim@example.com',
        category: 'Electrician',
        skills: 'Wiring',
        availability: 'Full Time',
        status: 'Active',
        phone: '01711000000',
        profile_image: null,
    },
    {
        id: 2,
        name: 'Karim Hossain',
        email: 'karim@example.com',
        category: 'Plumber',
        skills: 'Pipes',
        availability: 'Part Time',
        status: 'Active',
        phone: '01811000000',
        profile_image: null,
    },
];

describe('ManageLabourListings Frontend Component', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                success: true,
                data: MOCK_LISTINGS,
            }),
        });
    });

    it('renders heading and main layout', async () => {
        render(<ManageLabourListings />);
        expect(screen.getByText('Manage Labor Listings')).toBeInTheDocument();
        expect(screen.getByText('+ Add Laborer')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Rahim Ahmed')).toBeInTheDocument();
            expect(screen.getByText('Karim Hossain')).toBeInTheDocument();
        });
    });

    it('opens Add Laborer modal when button is clicked', async () => {
        render(<ManageLabourListings />);
        const addButton = screen.getByText('+ Add Laborer');
        fireEvent.click(addButton);

        expect(screen.getByText('Add Laborer')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
    });

    it('opens Edit Laborer modal and locks email field', async () => {
        render(<ManageLabourListings />);

        await waitFor(() => {
            expect(screen.getByText('Rahim Ahmed')).toBeInTheDocument();
        });

        const editButtons = screen.getAllByText('Edit');
        fireEvent.click(editButtons[0]);

        expect(screen.getByText('Edit Laborer')).toBeInTheDocument();
        expect(screen.getByText('(Locked 🔒)')).toBeInTheDocument();

        const emailInput = screen.getByDisplayValue('rahim@example.com');
        expect(emailInput).toBeDisabled();
    });

    it('filters labor listings by search query', async () => {
        render(<ManageLabourListings />);

        await waitFor(() => {
            expect(screen.getByText('Rahim Ahmed')).toBeInTheDocument();
            expect(screen.getByText('Karim Hossain')).toBeInTheDocument();
        });

        const searchInput = screen.getByPlaceholderText('Search laborer name or category...');
        fireEvent.change(searchInput, { target: { value: 'Rahim' } });

        expect(screen.getByText('Rahim Ahmed')).toBeInTheDocument();
        expect(screen.queryByText('Karim Hossain')).not.toBeInTheDocument();
    });

    it('displays error alert when submitting empty mandatory fields', async () => {
        render(<ManageLabourListings />);
        const addButton = screen.getByText('+ Add Laborer');
        fireEvent.click(addButton);

        const submitButton = screen.getByRole('button', { name: 'Create' });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Please complete all mandatory fields.')).toBeInTheDocument();
        });
    });
});
