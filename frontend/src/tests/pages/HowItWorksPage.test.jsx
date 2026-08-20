import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import HowItWorksPage from '../../pages/HowItWorksPage';

/**
 * Test suite for the HowItWorksPage component.
 * Tests cover rendering of steps, questions and user interactions.
 */
describe('HowItWorksPage', () => {

    /**
     * Helper function to render HowItWorksPage with router context.
     * @returns {object} The rendered component utilities.
     */
    const _renderHowItWorksPage = () => {
        return render(
            <MemoryRouter>
                <HowItWorksPage />
            </MemoryRouter>
        );
    };

    it('renders the Lok Lagbe brand name', () => {
        _renderHowItWorksPage();
        expect(screen.getByText('Lok')).toBeInTheDocument();
    });

    it('renders the page heading', () => {
        _renderHowItWorksPage();
        expect(
            screen.getByText('Hiring in six steps.')
        ).toBeInTheDocument();
    });

    it('renders all 6 hiring step titles', () => {
        _renderHowItWorksPage();
        expect(screen.getByText('Create an account')).toBeInTheDocument();
        expect(screen.getByText('Pick a job category')).toBeInTheDocument();
        expect(screen.getByText('Compare available laborers')).toBeInTheDocument();
        expect(screen.getByText('Confirm the hire')).toBeInTheDocument();
        expect(screen.getByText('Pay securely')).toBeInTheDocument();
        expect(screen.getByText('Rate and review')).toBeInTheDocument();
    });

    it('renders the common questions section', () => {
        _renderHowItWorksPage();
        expect(
            screen.getByText('Common questions')
        ).toBeInTheDocument();
    });

    it('renders all 4 common questions', () => {
        _renderHowItWorksPage();
        expect(
            screen.getByText('Do I need an account to browse?')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Can I review a laborer I did not hire?')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Are the prices fixed or hourly?')
        ).toBeInTheDocument();
        expect(
            screen.getByText('How do I find a past hire again?')
        ).toBeInTheDocument();
    });

    it('renders the Pricing link in the navbar', () => {
        _renderHowItWorksPage();
        expect(screen.getByText('Pricing')).toBeInTheDocument();
    });

    it('renders the Log in link in the navbar', () => {
        _renderHowItWorksPage();
        expect(screen.getByText('Log in')).toBeInTheDocument();
    });

    it('renders the create an account call to action button', () => {
        _renderHowItWorksPage();
        expect(
            screen.getByText('Create an account')
        ).toBeInTheDocument();
    });

    it('renders the footer text', () => {
        _renderHowItWorksPage();
        expect(
            screen.getByText('Made in Bangladesh')
        ).toBeInTheDocument();
    });

    it('navigates to register page when Get started is clicked', async () => {
        const user = userEvent.setup();
        _renderHowItWorksPage();
        await user.click(screen.getByText('Get started'));
    });

    it('navigates to homepage when the brand name is clicked', async () => {
        const user = userEvent.setup();
        _renderHowItWorksPage();
        await user.click(screen.getByText('Lok'));
    });

});