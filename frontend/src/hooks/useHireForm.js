import { useState } from "react";


const INITIAL_VALUES = {
    work_date: "",
    start_time: "",
    duration: "",
    address: "",
    notes: "",
};


function _getTodayValue() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function _isValidDateValue(value) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) {
        return false;
    }

    const [, year, month, day] = match.map(Number);
    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year
        && date.getMonth() === month - 1
        && date.getDate() === day
    );
}


function _validateHireForm(values) {
    const errors = {};
    const duration = Number(values.duration);

    if (!values.work_date) {
        errors.work_date = "Select a work date.";
    } else if (!_isValidDateValue(values.work_date)) {
        errors.work_date = "Enter a valid work date.";
    } else if (values.work_date < _getTodayValue()) {
        errors.work_date = "Work date cannot be in the past.";
    }

    if (!values.start_time) {
        errors.start_time = "Select a start time.";
    } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(values.start_time)) {
        errors.start_time = "Enter a valid start time.";
    }

    if (values.duration === "") {
        errors.duration = "Enter the job duration.";
    } else if (!Number.isFinite(duration)) {
        errors.duration = "Enter a valid duration.";
    } else if (duration < 0.5 || duration > 24) {
        errors.duration = "Duration must be between 0.5 and 24 hours.";
    }

    if (!values.address.trim()) {
        errors.address = "Enter the job address.";
    } else if (values.address.trim().length > 255) {
        errors.address = "Job address cannot exceed 255 characters.";
    }

    return errors;
}


function _extractFieldErrors(details) {
    const supportedFields = [
        "work_date",
        "start_time",
        "duration",
        "address",
        "notes",
    ];

    if (!details || typeof details !== "object") {
        return {};
    }

    return supportedFields.reduce((fieldErrors, fieldName) => {
        const message = details[fieldName];
        if (Array.isArray(message) && message.length > 0) {
            fieldErrors[fieldName] = String(message[0]);
        } else if (typeof message === "string") {
            fieldErrors[fieldName] = message;
        }
        return fieldErrors;
    }, {});
}


function useHireForm(onValidSubmit) {
    const [values, setValues] = useState(INITIAL_VALUES);
    const [errors, setErrors] = useState({});
    const [submitError, setSubmitError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setValues((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));
        setErrors((currentErrors) => ({
            ...currentErrors,
            [name]: undefined,
        }));
        setSubmitError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const validationErrors = _validateHireForm(values);
        setErrors(validationErrors);
        setSubmitError("");

        const firstInvalidField = Object.keys(validationErrors)[0];
        if (firstInvalidField) {
            event.currentTarget.elements[firstInvalidField]?.focus();
            return;
        }

        const normalizedValues = {
            ...values,
            duration: Number(values.duration),
            address: values.address.trim(),
            notes: values.notes.trim(),
        };

        const form = event.currentTarget;
        setIsSubmitting(true);

        try {
            await onValidSubmit(normalizedValues);
        } catch (error) {
            const fieldErrors = _extractFieldErrors(error.details);
            setErrors(fieldErrors);
            setSubmitError(
                error.message || "The booking could not be created.",
            );

            const firstServerField = Object.keys(fieldErrors)[0];
            form.elements[firstServerField]?.focus();
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        values,
        errors,
        submitError,
        isSubmitting,
        minimumDate: _getTodayValue(),
        handleChange,
        handleSubmit,
    };
}


export { _extractFieldErrors, _validateHireForm };
export default useHireForm;
