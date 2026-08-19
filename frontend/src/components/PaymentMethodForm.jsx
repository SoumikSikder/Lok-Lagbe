import { useState } from "react";

import { PAYMENT_METHODS } from "../services/paymentSimulation.js";


/**
 * Select and confirm one simulated payment method.
 *
 * @param {object} props Component properties.
 * @param {Function} props.onConfirm Callback receiving the selected method.
 * @returns {JSX.Element} Accessible payment-method selection form.
 */
function PaymentMethodForm({ onConfirm }) {
    const [selectedMethod, setSelectedMethod] = useState("");
    const [error, setError] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    async function _handleSubmit(event) {
        event.preventDefault();

        if (!selectedMethod) {
            setError("Select a payment method before continuing.");
            return;
        }

        setError("");
        setIsProcessing(true);

        try {
            const method = PAYMENT_METHODS.find(
                (paymentMethod) => paymentMethod.id === selectedMethod,
            );
            await onConfirm(method);
        } finally {
            setIsProcessing(false);
        }
    }

    function _handleChange(event) {
        setSelectedMethod(event.target.value);
        setError("");
    }

    return (
        <form
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8"
            onSubmit={_handleSubmit}
            noValidate
        >
            <fieldset>
                <legend className="text-3xl font-bold tracking-tight text-slate-900">
                    Choose a payment method
                </legend>
                <p className="mt-3 leading-7 text-slate-600">
                    Select one option to simulate payment confirmation.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {PAYMENT_METHODS.map((method) => (
                        <label
                            key={method.id}
                            className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-md ${
                                selectedMethod === method.id
                                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
                                    : "border-slate-200 bg-white"
                            }`}
                        >
                            <input
                                type="radio"
                                name="payment_method"
                                value={method.id}
                                checked={selectedMethod === method.id}
                                onChange={_handleChange}
                                required
                                aria-invalid={Boolean(error)}
                                aria-describedby={
                                    error ? "payment-method-error" : undefined
                                }
                                className="mt-1 size-4 accent-brand-600"
                            />
                            <span
                                className={`flex size-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${method.color}`}
                                aria-hidden="true"
                            >
                                {method.symbol}
                            </span>
                            <span>
                                <span className="block font-bold text-slate-900">
                                    {method.name}
                                </span>
                                <span className="mt-1 block text-sm leading-5 text-slate-500">
                                    {method.description}
                                </span>
                            </span>
                        </label>
                    ))}
                </div>
            </fieldset>

            {error && (
                <p
                    id="payment-method-error"
                    className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
                    role="alert"
                >
                    {error}
                </p>
            )}

            <button
                type="submit"
                disabled={isProcessing}
                className="mt-8 w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
            >
                {isProcessing ? "Confirming payment..." : "Confirm payment"}
            </button>
        </form>
    );
}


export default PaymentMethodForm;
