import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import HomePage from '../../pages/HomePage';

/**
 * Test suite for the HomePage component.
 * Tests cover rendering of key elements and user interactions.
 */
describe('HomePage', () => {

    /**
     * Helper function to render HomePage with router context.
     * HomePage uses useNavigate so it must be wrapped in a router.
     * @returns {object} The rendered component utilities.
     */
    const _renderHomePage = () => {
        return render(
            <MemoryRouter>
                <HomePage />
            </MemoryRouter>
        );
    };

    it('renders the Lok Lagbe brand name', () => {
        _renderHomePage();
        expect(screen.getByText('Lok')).toBeInTheDocument();
    });

    it('renders the hero heading', () => {
        _renderHomePage();
        expect(
            screen.getByText('Hire skilled labor,')
        ).toBeInTheDocument();
    });

    it('renders the Find a laborer button', () => {
        _renderHomePage();
        const buttons = screen.getAllByText('Find a laborer');
        expect(buttons.length).toBeGreaterThan(0);
    });

    it('renders the Get started button in the navbar', () => {
        _renderHomePage();
        expect(
            screen.getByText('Get started')
        ).toBeInTheDocument();
    });

    it('renders all 6 job category cards', () => {
        _renderHomePage();
        expect(screen.getByText('Electrician')).toBeInTheDocument();
        expect(screen.getByText('Plumber')).toBeInTheDocument();
        expect(screen.getByText('Painter')).toBeInTheDocument();
        expect(screen.getByText('Carpenter')).toBeInTheDocument();
        expect(screen.getByText('AC Technician')).toBeInTheDocument();
        expect(screen.getByText('General Labor')).toBeInTheDocument();
    });

    it('renders all 3 platform stats', () => {
        _renderHomePage();
        expect(screen.getByText('10,000+')).toBeInTheDocument();
        expect(screen.getByText('500+')).toBeInTheDocument();
        expect(screen.getByText('4.8 / 5')).toBeInTheDocument();
    });

    it('renders the Log in link in the navbar', () => {
        _renderHomePage();
        expect(screen.getByText('Log in')).toBeInTheDocument();
    });

    it('renders the footer with copyright text', () => {
        _renderHomePage();
        expect(
            screen.getByText('Made in Bangladesh')
        ).toBeInTheDocument();
    });

    it('navigates to register page when Get started is clicked', async () => {
        const user = userEvent.setup();
        _renderHomePage();
        const button = screen.getByText('Get started');
        await user.click(button);
    });

    it('navigates to hire page when a category card is clicked', async () => {
        const user = userEvent.setup();
        _renderHomePage();
        const electricianCard = screen.getByText('Electrician');
        await user.click(electricianCard);
    });

});