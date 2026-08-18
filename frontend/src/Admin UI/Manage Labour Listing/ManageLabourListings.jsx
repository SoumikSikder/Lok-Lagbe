import React, { useState, useEffect } from 'react';

/**
 * Constant defining API endpoint base URL.
 */
const API_BASE_URL = 'http://localhost:8000/api/admin/labour-listings/';

/**
 * Constant list of available labor categories.
 */
const CATEGORY_OPTIONS = [
    'Electrician',
    'Plumber',
    'Painter',
    'Carpenter',
    'Cleaner',
    'Mason',
    'Gardener',
    'General Laborer',
];

/**
 * Constant list of availability statuses.
 */
const AVAILABILITY_OPTIONS = [
    'Full Time',
    'Part Time',
    'Weekends',
    'On Call',
];

/**
 * Constant list of listing statuses.
 */
const STATUS_OPTIONS = [
    'Active',
    'Pending',
    'Inactive',
];

/**
 * Constant list of allowed profile image extensions.
 */
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Component for System Administrators to manage labor listings.
 *
 * Allows viewing, searching, creating, updating (with locked email),
 * and deleting labor listing profiles.
 *
 * @param {Object} props Component properties
 * @returns {JSX.Element} Rendered ManageLabourListings UI component
 */
function ManageLabourListings(props) {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('success');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        category: 'Electrician',
        skills: '',
        availability: 'Full Time',
        status: 'Active',
        phone: '',
    });

    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        _fetchListings();
    }, []);

    /**
     * Fetches all labor listings from the backend API.
     *
     * @returns {Promise<void>} Resolves when listings are loaded
     */
    const _fetchListings = async () => {
        setLoading(true);
        try {
            const response = await fetch(API_BASE_URL);
            const result = await response.json();
            if (response.ok && result.success) {
                setListings(result.data || []);
            } else {
                _showAlert('Failed to load labor listings from server.', 'error');
            }
        } catch (error) {
            _showAlert('Database update fails. Please check server connection.', 'error');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Displays a notification alert message banner.
     *
     * @param {string} message Text message to display
     * @param {string} type Alert type ('success' or 'error')
     */
    const _showAlert = (message, type = 'success') => {
        setAlertMessage(message);
        setAlertType(type);
        setTimeout(() => {
            setAlertMessage(null);
        }, 5000);
    };

    /**
     * Handles text input field value changes.
     *
     * @param {React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} event Input change event
     */
    const _handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handles file input selection and validates image format.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event File input change event
     */
    const _handleFileChange = (event) => {
        const file = event.target.files[0];
        if (!file) {
            setProfileImage(null);
            setImagePreview(null);
            return;
        }

        const fileName = file.name.toLowerCase();
        const isValidExtension = ALLOWED_IMAGE_EXTENSIONS.some((ext) =>
            fileName.endsWith(ext)
        );

        if (!isValidExtension) {
            _showAlert(
                'Unsupported profile image format. Please upload a JPG, JPEG, PNG, or WEBP image.',
                'error'
            );
            event.target.value = '';
            setProfileImage(null);
            setImagePreview(null);
            return;
        }

        setProfileImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    /**
     * Resets the form fields and closes the modal dialog.
     */
    const _resetForm = () => {
        setFormData({
            name: '',
            email: '',
            category: 'Electrician',
            skills: '',
            availability: 'Full Time',
            status: 'Active',
            phone: '',
        });
        setProfileImage(null);
        setImagePreview(null);
        setSelectedId(null);
        setIsEditMode(false);
        setIsModalOpen(false);
    };

    /**
     * Opens modal dialog for creating a new labor listing.
     */
    const _openAddModal = () => {
        _resetForm();
        setIsEditMode(false);
        setIsModalOpen(true);
    };

    /**
     * Opens modal dialog for editing an existing labor listing.
     *
     * @param {Object} listing Labor listing data object
     */
    const _openEditModal = (listing) => {
        setSelectedId(listing.id);
        setFormData({
            name: listing.name,
            email: listing.email,
            category: listing.category,
            skills: listing.skills || '',
            availability: listing.availability || 'Full Time',
            status: listing.status || 'Active',
            phone: listing.phone,
        });
        setImagePreview(listing.profile_image || null);
        setProfileImage(null);
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    /**
     * Validates form inputs before submitting to API.
     *
     * @returns {boolean} True if valid, false otherwise
     */
    const _validateForm = () => {
        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.category.trim() ||
            !formData.phone.trim()
        ) {
            _showAlert('Please complete all mandatory fields.', 'error');
            return false;
        }
        return true;
    };

    /**
     * Submits form data to create or update a labor listing.
     *
     * @param {React.FormEvent} event Form submission event
     */
    const _handleSubmit = async (event) => {
        event.preventDefault();

        if (!_validateForm()) {
            return;
        }

        const bodyData = new FormData();
        bodyData.append('name', formData.name);
        bodyData.append('email', formData.email);
        bodyData.append('category', formData.category);
        bodyData.append('skills', formData.skills);
        bodyData.append('availability', formData.availability);
        bodyData.append('status', formData.status);
        bodyData.append('phone', formData.phone);

        if (profileImage) {
            bodyData.append('profile_image', profileImage);
        }

        const url = isEditMode
            ? `${API_BASE_URL}${selectedId}/`
            : API_BASE_URL;

        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                body: bodyData,
            });

            const result = await response.json();

            if (response.ok && result.success) {
                _showAlert(
                    result.message || 'Labor listing has been managed successfully.',
                    'success'
                );
                _resetForm();
                _fetchListings();
            } else {
                const errorMsg =
                    result.message ||
                    (result.errors && JSON.stringify(result.errors)) ||
                    'Database update fails. Please try again.';
                _showAlert(errorMsg, 'error');
            }
        } catch (error) {
            _showAlert(
                'Server connection error. Please attempt the update again.',
                'error'
            );
        }
    };

    /**
     * Deletes a labor listing profile after user confirmation.
     *
     * @param {number} id Labor listing ID to delete
     */
    const _handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this labor listing?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${id}/`, {
                method: 'DELETE',
            });
            const result = await response.json();

            if (response.ok && result.success) {
                _showAlert('Labor listing removed successfully.', 'success');
                _fetchListings();
            } else {
                _showAlert('Failed to remove labor listing.', 'error');
            }
        } catch (error) {
            _showAlert('Database update fails. Changes not saved.', 'error');
        }
    };

    const filteredListings = listings.filter((item) => {
        const matchesQuery =
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.skills.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            !categoryFilter || item.category === categoryFilter;
        return matchesQuery && matchesCategory;
    });

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Manage Labor Listings</h2>
                    <p style={styles.subtitle}>
                        System Administrator Dashboard — Manage worker profiles, availability, and details.
                    </p>
                </div>
                <button
                    type="button"
                    style={styles.addButton}
                    onClick={_openAddModal}
                >
                    + Add New Laborer
                </button>
            </div>

            {/* Notification Banner */}
            {alertMessage && (
                <div
                    style={{
                        ...styles.alertBanner,
                        backgroundColor: alertType === 'success' ? '#d4edda' : '#f8d7da',
                        color: alertType === 'success' ? '#155724' : '#721c24',
                        borderColor: alertType === 'success' ? '#c3e6cb' : '#f5c6cb',
                    }}
                >
                    {alertMessage}
                </div>
            )}

            {/* Controls Bar */}
            <div style={styles.controlsBar}>
                <input
                    type="text"
                    placeholder="Search by name, category, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={styles.filterSelect}
                >
                    <option value="">All Categories</option>
                    {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>

            {/* Listings Table */}
            {loading ? (
                <div style={styles.loadingState}>Loading labor listings...</div>
            ) : filteredListings.length === 0 ? (
                <div style={styles.emptyState}>No labor listings found.</div>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Photo</th>
                                <th style={styles.th}>Name</th>
                                <th style={styles.th}>Category</th>
                                <th style={styles.th}>Skills</th>
                                <th style={styles.th}>Availability</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Contact</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredListings.map((item) => (
                                <tr key={item.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        {item.profile_image ? (
                                            <img
                                                src={item.profile_image}
                                                alt={item.name}
                                                style={styles.avatarImg}
                                            />
                                        ) : (
                                            <div style={styles.avatarPlaceholder}>
                                                {item.name.charAt(0)}
                                            </div>
                                        )}
                                    </td>
                                    <td style={styles.td}>
                                        <strong>{item.name}</strong>
                                    </td>
                                    <td style={styles.td}>{item.category}</td>
                                    <td style={styles.td}>{item.skills || 'N/A'}</td>
                                    <td style={styles.td}>{item.availability}</td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.statusBadge,
                                                backgroundColor:
                                                    item.status === 'Active'
                                                        ? '#28a745'
                                                        : item.status === 'Pending'
                                                        ? '#ffc107'
                                                        : '#6c757d',
                                            }}
                                        >
                                            {item.status}
                                        </span>
                                    </td>
                                    <td style={styles.td}>
                                        <div>{item.phone}</div>
                                        <small style={{ color: '#6c757d' }}>{item.email}</small>
                                    </td>
                                    <td style={styles.td}>
                                        <button
                                            type="button"
                                            style={styles.editBtn}
                                            onClick={() => _openEditModal(item)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            style={styles.deleteBtn}
                                            onClick={() => _handleDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Dialog Form */}
            {isModalOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h3 style={styles.modalTitle}>
                            {isEditMode ? 'Edit Labor Listing' : 'Add New Laborer'}
                        </h3>
                        <form onSubmit={_handleSubmit}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Full Name <span style={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={_handleInputChange}
                                    style={styles.input}
                                    placeholder="e.g. Rahim Ahmed"
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Email Address <span style={styles.required}>*</span>
                                    {isEditMode && (
                                        <span style={styles.lockedTag}> 🔒 (Locked)</span>
                                    )}
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={_handleInputChange}
                                    disabled={isEditMode}
                                    style={{
                                        ...styles.input,
                                        backgroundColor: isEditMode ? '#e9ecef' : '#ffffff',
                                        cursor: isEditMode ? 'not-allowed' : 'text',
                                    }}
                                    placeholder="e.g. rahim@example.com"
                                />
                            </div>

                            <div style={styles.formRow}>
                                <div style={{ ...styles.formGroup, flex: 1 }}>
                                    <label style={styles.label}>
                                        Category <span style={styles.required}>*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={_handleInputChange}
                                        style={styles.input}
                                    >
                                        {CATEGORY_OPTIONS.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ ...styles.formGroup, flex: 1 }}>
                                    <label style={styles.label}>
                                        Phone Number <span style={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={_handleInputChange}
                                        style={styles.input}
                                        placeholder="01711000000"
                                    />
                                </div>
                            </div>

                            <div style={styles.formRow}>
                                <div style={{ ...styles.formGroup, flex: 1 }}>
                                    <label style={styles.label}>Availability</label>
                                    <select
                                        name="availability"
                                        value={formData.availability}
                                        onChange={_handleInputChange}
                                        style={styles.input}
                                    >
                                        {AVAILABILITY_OPTIONS.map((opt) => (
                                            <option key={opt} value={opt}>
                                                {opt}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ ...styles.formGroup, flex: 1 }}>
                                    <label style={styles.label}>Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={_handleInputChange}
                                        style={styles.input}
                                    >
                                        {STATUS_OPTIONS.map((st) => (
                                            <option key={st} value={st}>
                                                {st}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Skills Description</label>
                                <textarea
                                    name="skills"
                                    rows="2"
                                    value={formData.skills}
                                    onChange={_handleInputChange}
                                    style={styles.textarea}
                                    placeholder="Wiring, Pipe Repair, Painting, etc."
                                />
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    Profile Image (.jpg, .jpeg, .png, .webp)
                                </label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={_handleFileChange}
                                    style={styles.input}
                                />
                                {imagePreview && (
                                    <div style={{ marginTop: '10px' }}>
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            style={styles.previewImg}
                                        />
                                    </div>
                                )}
                            </div>

                            <div style={styles.modalActions}>
                                <button
                                    type="button"
                                    style={styles.cancelBtn}
                                    onClick={_resetForm}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={styles.submitBtn}
                                >
                                    {isEditMode ? 'Save Changes' : 'Create Listing'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '16px',
    },
    title: {
        margin: 0,
        color: '#1a252f',
        fontSize: '24px',
    },
    subtitle: {
        margin: '4px 0 0 0',
        color: '#7f8c8d',
        fontSize: '14px',
    },
    addButton: {
        backgroundColor: '#007bff',
        color: '#ffffff',
        border: 'none',
        padding: '10px 18px',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    alertBanner: {
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '16px',
        border: '1px solid',
        fontWeight: '500',
    },
    controlsBar: {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px',
    },
    searchInput: {
        flex: 1,
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #ced4da',
        fontSize: '14px',
    },
    filterSelect: {
        padding: '10px 14px',
        borderRadius: '6px',
        border: '1px solid #ced4da',
        fontSize: '14px',
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
    },
    th: {
        backgroundColor: '#f8f9fa',
        padding: '12px',
        borderBottom: '2px solid #dee2e6',
        color: '#495057',
        fontSize: '13px',
        textTransform: 'uppercase',
    },
    tr: {
        borderBottom: '1px solid #e9ecef',
    },
    td: {
        padding: '12px',
        verticalAlign: 'middle',
        fontSize: '14px',
    },
    avatarImg: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    avatarPlaceholder: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
    },
    statusBadge: {
        color: '#ffffff',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
    },
    editBtn: {
        backgroundColor: '#ffc107',
        color: '#212529',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        marginRight: '6px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    deleteBtn: {
        backgroundColor: '#dc3545',
        color: '#ffffff',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    loadingState: {
        padding: '40px',
        textAlign: 'center',
        color: '#6c757d',
    },
    emptyState: {
        padding: '40px',
        textAlign: 'center',
        color: '#6c757d',
    },
    modalOverlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: '24px',
        borderRadius: '8px',
        width: '500px',
        maxWidth: '90%',
        maxHeight: '90vh',
        overflowY: 'auto',
    },
    modalTitle: {
        marginTop: 0,
        marginBottom: '16px',
        color: '#212529',
    },
    formGroup: {
        marginBottom: '14px',
    },
    formRow: {
        display: 'flex',
        gap: '12px',
    },
    label: {
        display: 'block',
        marginBottom: '4px',
        fontSize: '13px',
        fontWeight: 'bold',
        color: '#495057',
    },
    required: {
        color: '#dc3545',
    },
    lockedTag: {
        color: '#dc3545',
        fontSize: '12px',
    },
    input: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    textarea: {
        width: '100%',
        padding: '8px 12px',
        borderRadius: '4px',
        border: '1px solid #ced4da',
        fontSize: '14px',
        boxSizing: 'border-box',
    },
    previewImg: {
        width: '60px',
        height: '60px',
        borderRadius: '8px',
        objectFit: 'cover',
    },
    modalActions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px',
    },
    cancelBtn: {
        backgroundColor: '#6c757d',
        color: '#ffffff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    submitBtn: {
        backgroundColor: '#28a745',
        color: '#ffffff',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
};

export default ManageLabourListings;
