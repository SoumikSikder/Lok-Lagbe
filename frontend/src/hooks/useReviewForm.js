import { useState } from "react";


const INITIAL_VALUES = {
    rating: "",
    comment: "",
};


function _validateReviewForm(values) {
    const errors = {};
    const rating = Number(values.rating);

    if (values.rating === "") {
        errors.rating = "Select a rating.";
    } else if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        errors.rating = "Rating must be a whole number from 1 to 5.";
    }

    return errors;
}


function _extractReviewFieldErrors(details) {
    if (!details || typeof details !== "object") {
        return {};
    }

    return ["rating", "comment"].reduce((errors, fieldName) => {
        const message = details[fieldName];
        if (Array.isArray(message) && message.length > 0) {
            errors[fieldName] = String(message[0]);
        } else if (typeof message === "string") {
            errors[fieldName] = message;
        }
        return errors;
    }, {});
}


function useReviewForm(onValidSubmit) {
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

        const validationErrors = _validateReviewForm(values);
        setErrors(validationErrors);
        setSubmitError("");

        const firstInvalidField = Object.keys(validationErrors)[0];
        if (firstInvalidField) {
            event.currentTarget.elements[firstInvalidField]?.[0]?.focus();
            return;
        }

        const form = event.currentTarget;
        setIsSubmitting(true);

        try {
            await onValidSubmit({
                rating: Number(values.rating),
                comment: values.comment.trim(),
            });
            setValues(INITIAL_VALUES);
        } catch (error) {
            const fieldErrors = _extractReviewFieldErrors(error.details);
            setErrors(fieldErrors);
            setSubmitError(
                error.message || "The review could not be submitted.",
            );

            if (fieldErrors.rating) {
                form.elements.rating?.[0]?.focus();
            } else if (fieldErrors.comment) {
                form.elements.comment?.focus();
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return {
        values,
        errors,
        submitError,
        isSubmitting,
        handleChange,
        handleSubmit,
    };
}


export { _extractReviewFieldErrors, _validateReviewForm };
export default useReviewForm;
