/**
 * Display one accessible form validation message.
 *
 * @param {object} props Component properties.
 * @param {string} props.id Element ID referenced by the related field.
 * @param {string|undefined} props.message Validation message.
 * @returns {JSX.Element|null} Validation text when a message exists.
 */
function FormFieldError({ id, message }) {
    if (!message) {
        return null;
    }

    return (
        <p id={id} className="mt-2 text-sm font-medium text-red-600">
            {message}
        </p>
    );
}


export default FormFieldError;
