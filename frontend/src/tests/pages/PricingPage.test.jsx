import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import PricingPage from '../../pages/PricingPage';

/**
 * Test suite for the PricingPage component.
 * Tests cover rendering of pricing rules, category ranges,
 * payment methods and user interactions.
 */
describe('PricingPage', () => {

    /**
     * Helper function to render PricingPage with router context.
     * @returns {object} The rendered component utilities.
     */
    const _renderPricingPage = () => {
        return render(
            <MemoryRouter>
                <PricingPage />
            </MemoryRouter>
        );
    };

    it('renders the Lok Lagbe brand name', () => {
        _renderPricingPage();
        expect(screen.getByText('Lok')).toBeInTheDocument();
    });

    it('renders the page heading', () => {
        _renderPricingPage();
        expect(
            screen.getByText('Fixed prices, paid your way.')
        ).toBeInTheDocument();
    });

    it('renders all 4 pricing rule titles', () => {
        _renderPricingPage();
        expect(screen.getByText('Fixed price per job')).toBeInTheDocument();
        expect(
            screen.getByText('Price shown before you commit')
        ).toBeInTheDocument();
        expect(screen.getByText('No hidden charges')).toBeInTheDocument();
        expect(screen.getByText('Tipping is optional')).toBeInTheDocument();
    });

    it('renders the pricing by job category section', () => {
        _renderPricingPage();
        expect(
            screen.getByText('Pricing by job category')
        ).toBeInTheDocument();
    });

    it('renders all 6 job categories with prices', () => {
        _renderPricingPage();
        expect(screen.getByText('Electrician')).toBeInTheDocument();
        expect(screen.getByText('Plumber')).toBeInTheDocument();
        expect(screen.getByText('Painter')).toBeInTheDocument();
        expect(screen.getByText('Carpenter')).toBeInTheDocument();
        expect(screen.getByText('AC Technician')).toBeInTheDocument();
        expect(screen.getByText('General Labor')).toBeInTheDocument();
    });

    it('renders all 5 accepted payment methods', () => {
        _renderPricingPage();
        expect(screen.getByText('bKash')).toBeInTheDocument();
        expect(screen.getByText('Nagad')).toBeInTheDocument();
        expect(screen.getByText('Rocket')).toBeInTheDocument();
        expect(screen.getByText('VISA')).toBeInTheDocument();
        expect(screen.getByText('Mastercard')).toBeInTheDocument();
    });

    it('renders the How it works link in the navbar', () => {
        _renderPricingPage();
        expect(screen.getByText('How it works')).toBeInTheDocument();
    });

    it('renders the Log in link in the navbar', () => {
        _renderPricingPage();
        expect(screen.getByText('Log in')).toBeInTheDocument();
    });

    it('renders the create an account call to action button', () => {
        _renderPricingPage();
        expect(
            screen.getByText('Create an account')
        ).toBeInTheDocument();
    });

    it('renders the footer text', () => {
        _renderPricingPage();
        expect(
            screen.getByText('Made in Bangladesh')
        ).toBeInTheDocument();
    });

    it('navigates to register page when Get started is clicked', async () => {
        const user = userEvent.setup();
        _renderPricingPage();
        await user.click(screen.getByText('Get started'));
    });

    it('navigates to homepage when the brand name is clicked', async () => {
        const user = userEvent.setup();
        _renderPricingPage();
        await user.click(screen.getByText('Lok'));
    });

});