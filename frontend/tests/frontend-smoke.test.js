import assert from "node:assert/strict";
import { test } from "vitest";

import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router";


test("hire and review validation reject invalid values", async () => {
    const { _validateHireForm } = await import(
        "../src/hooks/useHireForm.js"
    );
    const { _validateReviewForm } = await import(
        "../src/hooks/useReviewForm.js"
    );

    const hireErrors = _validateHireForm({
        work_date: "2000-01-01",
        start_time: "25:00",
        duration: "25",
        address: " ",
        notes: "",
    });
    assert.deepEqual(
        Object.keys(hireErrors),
        ["work_date", "start_time", "duration", "address"],
    );
    assert.equal(
        Object.keys(
            _validateHireForm({
                work_date: "2099-12-31",
                start_time: "09:30",
                duration: "2.5",
                address: "Dhanmondi, Dhaka",
                notes: "",
            }),
        ).length,
        0,
    );
    assert.ok(_validateReviewForm({ rating: "0", comment: "" }).rating);
    assert.equal(
        Object.keys(_validateReviewForm({ rating: "5", comment: "Good" }))
            .length,
        0,
    );
});


test("Django field errors map to their frontend fields", async () => {
    const { _extractFieldErrors } = await import(
        "../src/hooks/useHireForm.js"
    );
    const { _extractReviewFieldErrors } = await import(
        "../src/hooks/useReviewForm.js"
    );

    assert.deepEqual(
        _extractFieldErrors({
            duration: ["Invalid duration."],
            labor: ["Unavailable."],
        }),
        { duration: "Invalid duration." },
    );
    assert.deepEqual(
        _extractReviewFieldErrors({
            rating: ["Invalid rating."],
            labor: ["Duplicate review."],
        }),
        { rating: "Invalid rating." },
    );
});


test("labor query parameters omit empty values", async () => {
    const { _cleanParameters } = await import(
        "../src/services/laborService.js"
    );

    assert.deepEqual(
        _cleanParameters({
            search: "Dhaka",
            category: " ",
            rating: null,
            min_wage: undefined,
            max_wage: "500",
            page: 2,
        }),
        {
            search: "Dhaka",
            max_wage: "500",
            page: 2,
        },
    );
});


test("labor cards expose details and valid hiring actions", async () => {
    const { default: LaborCard } = await import(
        "../src/components/LaborCard.jsx"
    );
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
            React.createElement(LaborCard, { labor }),
        ),
    );

    assert.match(html, /Rahim Uddin/);
    assert.match(html, /\/labors\/7\/hire/);
    assert.match(html, /\/labors\/7/);
    assert.match(html, /Available/);
});


test("numbered pagination exposes current and adjacent pages", async () => {
    const { default: Pagination } = await import(
        "../src/components/Pagination.jsx"
    );
    const html = renderToString(
        React.createElement(Pagination, {
            currentPage: 2,
            pageCount: 3,
            hasNextPage: true,
            hasPreviousPage: true,
            onPageChange: () => {},
        }),
    );

    assert.match(html, /aria-label="Previous page"/);
    assert.match(html, /aria-current="page"/);
    assert.match(html, /aria-label="Next page"/);
    assert.match(html, />3<\/button>/);
});


test("booking confirmation renders the persisted booking", async () => {
    const { default: BookingConfirmation } = await import(
        "../src/components/BookingConfirmation.jsx"
    );
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
            React.createElement(BookingConfirmation, { booking }),
        ),
    ).replaceAll("<!-- -->", "");

    assert.match(html, /Booking #42/);
    assert.match(html, /Rahim Uddin/);
    assert.match(html, /Pending/);
    assert.match(html, /\/bookings\/42\/payment/);
});


test("payment simulation supports every required method", async () => {
    const { PAYMENT_METHODS, _calculateBookingTotal } = await import(
        "../src/services/paymentSimulation.js"
    );
    const { default: PaymentMethodForm } = await import(
        "../src/components/PaymentMethodForm.jsx"
    );
    const { default: PaymentSuccess } = await import(
        "../src/components/PaymentSuccess.jsx"
    );
    const booking = {
        id: 42,
        labor_name: "Rahim Uddin",
        labor_hourly_wage: "450.00",
        duration: "2.50",
    };

    assert.equal(_calculateBookingTotal(booking), 1125);
    assert.deepEqual(
        PAYMENT_METHODS.map((method) => method.name),
        ["bKash", "Nagad", "Visa/MasterCard", "Cash"],
    );

    const formHtml = renderToString(
        React.createElement(PaymentMethodForm, { onConfirm: () => {} }),
    );
    const successHtml = renderToString(
        React.createElement(
            MemoryRouter,
            null,
            React.createElement(PaymentSuccess, {
                booking,
                method: PAYMENT_METHODS[0],
            }),
        ),
    );

    assert.match(formHtml, /Confirm payment/);
    assert.match(successHtml, /Payment Successful/);
    assert.match(successHtml, /No real payment was processed/);
});


test("application routes render their initial loading states", async () => {
    const { default: App } = await import("../src/App.jsx");

    const laborHtml = renderToString(
        React.createElement(
            MemoryRouter,
            { initialEntries: ["/labors"] },
            React.createElement(App),
        ),
    );
    const hireHtml = renderToString(
        React.createElement(
            MemoryRouter,
            { initialEntries: ["/labors/7/hire"] },
            React.createElement(App),
        ),
    );
    const paymentHtml = renderToString(
        React.createElement(
            MemoryRouter,
            { initialEntries: ["/bookings/42/payment"] },
            React.createElement(App),
        ),
    );

    assert.match(laborHtml, /Loading labor listings/);
    assert.match(hireHtml, /Preparing hiring form/);
    assert.match(paymentHtml, /Preparing payment/);
});
