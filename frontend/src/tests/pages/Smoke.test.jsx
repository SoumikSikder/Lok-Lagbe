import { describe, it, expect } from "vitest";
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";

import App from "../../App.jsx";
import { _validateHireForm, _extractFieldErrors } from "../../hooks/useHireForm.js";
import { _validateReviewForm, _extractReviewFieldErrors } from "../../hooks/useReviewForm.js";
import { _cleanParameters } from "../../services/laborService.js";
import { PAYMENT_METHODS, _calculateBookingTotal } from "../../services/paymentSimulation.js";
import LaborCard from "../../components/LaborCard.jsx";
import Pagination from "../../components/Pagination.jsx";
import BookingConfirmation from "../../components/BookingConfirmation.jsx";
import PaymentMethodForm from "../../components/PaymentMethodForm.jsx";
import PaymentSuccess from "../../components/PaymentSuccess.jsx";

/**
 * Smoke test suite covering form validation, error mapping,
 * query parameter cleaning, payment simulation and component rendering.
 */
describe("Frontend smoke tests", () => {

    it("hire and review validation reject invalid values", () => {
        const hireErrors = _validateHireForm({
            work_date: "2000-01-01",
            start_time: "25:00",
            duration: "25",
            address: " ",
            notes: "",
        });

        expect(Object.keys(hireErrors)).toEqual([
            "work_date",
            "start_time",
            "duration",
            "address",
        ]);

        const validHire = _validateHireForm({
            work_date: "2099-12-31",
            start_time: "09:30",
            duration: "2.5",
            address: "Dhanmondi, Dhaka",
            notes: "",
        });
        expect(Object.keys(validHire)).toHaveLength(0);

        expect(_validateReviewForm({ rating: "0", comment: "" }).rating).toBeTruthy();

        const validReview = _validateReviewForm({ rating: "5", comment: "Good" });
        expect(Object.keys(validReview)).toHaveLength(0);
    });

    it("Django field errors map to their frontend fields", () => {
        expect(
            _extractFieldErrors({
                duration: ["Invalid duration."],
                labor: ["Unavailable."],
            })
        ).toEqual({ duration: "Invalid duration." });

        expect(
            _extractReviewFieldErrors({
                rating: ["Invalid rating."],
                labor: ["Duplicate review."],
            })
        ).toEqual({ rating: "Invalid rating." });
    });

    it("labor query parameters omit empty values", () => {
        expect(
            _cleanParameters({
                search: "Dhaka",
                category: " ",
                rating: null,
                min_wage: undefined,
                max_wage: "500",
                page: 2,
            })
        ).toEqual({
            search: "Dhaka",
            max_wage: "500",
            page: 2,
        });
    });

    it("labor cards expose details and valid hiring actions", () => {
        const labor = {
            id: 7,
            name: "Rahim Uddin",
            photo: "",
            profession: "Electrician",
            category: "Electrician",
            location: "Dhaka",
            hourly_wage: "450.00",
            rating: "4.8",
            review_count: 12,
            description: "Residential electrical specialist.",
            available: true,
        };

        const html = renderToString(
            React.createElement(
                MemoryRouter,
                null,
                React.createElement(LaborCard, { labor })
            )
        );

        expect(html).toMatch(/Rahim Uddin/);
        expect(html).toMatch(/\/labors\/7\/hire/);
        expect(html).toMatch(/\/labors\/7/);
        expect(html).toMatch(/Available/);
    });

    it("numbered pagination exposes current and adjacent pages", () => {
        const html = renderToString(
            React.createElement(Pagination, {
                currentPage: 2,
                pageCount: 3,
                hasNextPage: true,
                hasPreviousPage: true,
                onPageChange: () => {},
            })
        );

        expect(html).toMatch(/aria-label="Previous page"/);
        expect(html).toMatch(/aria-current="page"/);
        expect(html).toMatch(/aria-label="Next page"/);
        expect(html).toMatch(/>3<\/button>/);
    });

    it("booking confirmation renders the persisted booking", () => {
        const booking = {
            id: 42,
            labor_name: "Rahim Uddin",
            work_date: "2099-12-31",
            start_time: "09:30:00",
            duration: "2.50",
            address: "Dhanmondi, Dhaka",
            notes: "Bring testing tools.",
            status: "pending",
            status_display: "Pending",
        };

        const html = renderToString(
            React.createElement(
                MemoryRouter,
                null,
                React.createElement(BookingConfirmation, { booking })
            )
        ).replaceAll("<!-- -->", "");

        expect(html).toMatch(/Booking #42/);
        expect(html).toMatch(/Rahim Uddin/);
        expect(html).toMatch(/Pending/);
        expect(html).toMatch(/\/bookings\/42\/payment/);
    });

    it("payment simulation supports every required method", () => {
        const booking = {
            id: 42,
            labor_name: "Rahim Uddin",
            labor_hourly_wage: "450.00",
            duration: "2.50",
        };

        expect(_calculateBookingTotal(booking)).toBe(1125);
        expect(PAYMENT_METHODS.map((method) => method.name)).toEqual([
            "bKash",
            "Nagad",
            "Visa/MasterCard",
            "Cash",
        ]);

        const formHtml = renderToString(
            React.createElement(PaymentMethodForm, { onConfirm: () => {} })
        );
        const successHtml = renderToString(
            React.createElement(
                MemoryRouter,
                null,
                React.createElement(PaymentSuccess, {
                    booking,
                    method: PAYMENT_METHODS[0],
                })
            )
        );

        expect(formHtml).toMatch(/Confirm payment/);
        expect(successHtml).toMatch(/Payment Successful/);
        expect(successHtml).toMatch(/No real payment was processed/);
    });

    it("application routes render their initial loading states", () => {
        const laborHtml = renderToString(
            React.createElement(
                MemoryRouter,
                { initialEntries: ["/labors"] },
                React.createElement(App)
            )
        );
        const hireHtml = renderToString(
            React.createElement(
                MemoryRouter,
                { initialEntries: ["/labors/7/hire"] },
                React.createElement(App)
            )
        );
        const paymentHtml = renderToString(
            React.createElement(
                MemoryRouter,
                { initialEntries: ["/bookings/42/payment"] },
                React.createElement(App)
            )
        );

        expect(laborHtml).toMatch(/Loading labor listings/);
        expect(hireHtml).toMatch(/Preparing hiring form/);
        expect(paymentHtml).toMatch(/Preparing payment/);
    });

});