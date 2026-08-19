const PAYMENT_METHODS = [
    {
        id: "bkash",
        name: "bKash",
        description: "Pay using your bKash mobile wallet.",
        symbol: "bK",
        color: "bg-pink-100 text-pink-700",
    },
    {
        id: "nagad",
        name: "Nagad",
        description: "Pay using your Nagad mobile wallet.",
        symbol: "N",
        color: "bg-orange-100 text-orange-700",
    },
    {
        id: "card",
        name: "Visa/MasterCard",
        description: "Simulate a debit or credit card payment.",
        symbol: "V/M",
        color: "bg-blue-100 text-blue-700",
    },
    {
        id: "cash",
        name: "Cash",
        description: "Choose cash payment for this booking.",
        symbol: "৳",
        color: "bg-emerald-100 text-emerald-700",
    },
];


function _calculateBookingTotal(booking) {
    const wage = Number(booking.labor_hourly_wage);
    const duration = Number(booking.duration);

    return Number.isFinite(wage) && Number.isFinite(duration)
        ? wage * duration
        : 0;
}


export { PAYMENT_METHODS, _calculateBookingTotal };
