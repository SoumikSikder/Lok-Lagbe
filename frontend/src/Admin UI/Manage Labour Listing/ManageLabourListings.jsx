import React, { useState, useEffect } from 'react';

/**
 * API endpoint base URL.
 */
const API_BASE_URL = 'http://localhost:8000/api/admin/labour-listings/';

/**
 * List of available professions.
 */
const CATEGORIES = [
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
 * Allowed profile image file extensions.
 */
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Simple React component for managing labor listings.
 *
 * @param {Object} props Component properties
 * @returns {JSX.Element} Simple Manage Labour Listings UI
 */
function ManageLabourListings(props) {
    const [listings, setListings] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [alert, setAlert] = useState(null);

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

    useEffect(() => {
        _fetchListings();
    }, []);

    /**
     * Fetches labor listings from API.
     */
    const _fetchListings = async () => {
        try {
            const res = await fetch(API_BASE_URL);
            const data = await res.json();
            if (res.ok && data.success) {
                setListings(data.data || []);
            } else {
                _showAlert('Failed to load listings.', 'error');
            }
        } catch (err) {
            _showAlert('Database connection error.', 'error');
        }
    };

    /**
     * Displays alert banner message.
     *
     * @param {string} msg Text to display
     * @param {string} type Alert type ('success' or 'error')
     */
    const _showAlert = (msg, type = 'success') => {
        setAlert({ msg, type });
        setTimeout(() => setAlert(null), 4000);
    };

    /**
     * Handles text & dropdown input changes.
     *
     * @param {Event} e Change event
     */
    const _handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    /**
     * Handles profile image selection and validates extension.
     *
     * @param {Event} e File input change event
     */
    const _handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            setProfileImage(null);
            return;
        }
        const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            _showAlert('Unsupported format! Upload JPG, JPEG, PNG, or WEBP.', 'error');
            e.target.value = '';
            setProfileImage(null);
            return;
        }
        setProfileImage(file);
    };

    /**
     * Resets form inputs and closes modal.
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
        setSelectedId(null);
        setIsEditMode(false);
        setIsModalOpen(false);
    };

    /**
     * Opens modal for adding a new listing.
     */
    const _openAddModal = () => {
        _resetForm();
        setIsModalOpen(true);
    };

    /**
     * Opens modal for editing an existing listing.
     *
     * @param {Object} item Labor listing object
     */
    const _openEditModal = (item) => {
        setSelectedId(item.id);
        setFormData({
            name: item.name,
            email: item.email,
            category: item.category,
            skills: item.skills || '',
            availability: item.availability || 'Full Time',
            status: item.status || 'Active',
            phone: item.phone,
        });
        setIsEditMode(true);
        setIsModalOpen(true);
    };

    /**
     * Validates form fields before submission.
     *
     * @returns {boolean} True if valid
     */
    const _validateForm = () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
            _showAlert('Please complete all mandatory fields.', 'error');
            return false;
        }
        return true;
    };

    /**
     * Submits form to create or update labor listing.
     *
     * @param {Event} e Submit event
     */
    const _handleSubmit = async (e) => {
        e.preventDefault();
        if (!_validateForm()) return;

        const data = new FormData();
        Object.keys(formData).forEach((key) => data.append(key, formData[key]));
        if (profileImage) data.append('profile_image', profileImage);

        const url = isEditMode ? `${API_BASE_URL}${selectedId}/` : API_BASE_URL;
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, { method, body: data });
            const result = await res.json();
            if (res.ok && result.success) {
                _showAlert(result.message || 'Managed successfully!', 'success');
                _resetForm();
                _fetchListings();
            } else {
                const msg = result.message || 'Database update fails.';
                _showAlert(msg, 'error');
            }
        } catch (err) {
            _showAlert('Server error. Changes not saved.', 'error');
        }
    };

    /**
     * Deletes a listing after user confirmation.
     *
     * @param {number} id Listing ID
     */
    const _handleDelete = async (id) => {
        if (!window.confirm('Delete this labor listing?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}${id}/`, { method: 'DELETE' });
            const result = await res.json();
            if (res.ok && result.success) {
                _showAlert('Removed successfully.', 'success');
                _fetchListings();
            } else {
                _showAlert('Deletion failed.', 'error');
            }
        } catch (err) {
            _showAlert('Database error.', 'error');
        }
    };

    const filtered = listings.filter((item) => {
        const matchesText = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.category.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = !categoryFilter || item.category === categoryFilter;
        return matchesText && matchesCat;
    });

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            {/* Title & Action Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                <h2>Manage Labor Listings</h2>
                <button onClick={_openAddModal} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    + Add Laborer
                </button>
            </div>

            {/* Alert Notification Banner */}
            {alert && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: alert.type === 'success' ? '#d4edda' : '#f8d7da',
                    color: alert.type === 'success' ? '#155724' : '#721c24',
                    borderRadius: '4px',
                }}>
                    {alert.msg}
                </div>
            )}

            {/* Search and Category Filter */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input
                    type="text"
                    placeholder="Search laborer name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ padding: '8px', flex: 1 }}
                />
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ padding: '8px' }}
                >
                    <option value="">All Categories</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Labor Listings Table */}
            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Availability</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>No labor listings found.</td>
                        </tr>
                    ) : (
                        filtered.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {item.profile_image ? (
                                        <img src={item.profile_image} alt={item.name} width="40" height="40" style={{ borderRadius: '50%' }} />
                                    ) : 'No Image'}
                                </td>
                                <td><strong>{item.name}</strong></td>
                                <td>{item.category}</td>
                                <td>{item.phone}</td>
                                <td>{item.email}</td>
                                <td>{item.availability}</td>
                                <td>{item.status}</td>
                                <td>
                                    <button onClick={() => _openEditModal(item)} style={{ marginRight: '5px' }}>Edit</button>
                                    <button onClick={() => _handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Modal Dialog Form */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '5px', width: '400px' }}>
                        <h3>{isEditMode ? 'Edit Laborer' : 'Add Laborer'}</h3>
                        <form onSubmit={_handleSubmit}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Name *</label><br />
                                <input type="text" name="name" value={formData.name} onChange={_handleInputChange} style={{ width: '100%', padding: '6px' }} />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label>Email * {isEditMode && <b style={{ color: 'red' }}>(Locked 🔒)</b>}</label><br />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={_handleInputChange}
                                    disabled={isEditMode}
                                    style={{ width: '100%', padding: '6px', background: isEditMode ? '#eee' : '#fff' }}
                                />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label>Category *</label><br />
                                <select name="category" value={formData.category} onChange={_handleInputChange} style={{ width: '100%', padding: '6px' }}>
                                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label>Phone *</label><br />
                                <input type="text" name="phone" value={formData.phone} onChange={_handleInputChange} style={{ width: '100%', padding: '6px' }} />
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label>Availability</label><br />
                                <select name="availability" value={formData.availability} onChange={_handleInputChange} style={{ width: '100%', padding: '6px' }}>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Weekends">Weekends</option>
                                    <option value="On Call">On Call</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label>Status</label><br />
                                <select name="status" value={formData.status} onChange={_handleInputChange} style={{ width: '100%', padding: '6px' }}>
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Inactive">Inactive</option>
                                </select>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <label>Profile Image (.jpg, .jpeg, .png, .webp)</label><br />
                                <input type="file" accept=".jpg,.jpeg,.png,.webp" onChange={_handleFileChange} />
                            </div>

                            <div style={{ textAlign: 'right', marginTop: '15px' }}>
                                <button type="button" onClick={_resetForm} style={{ marginRight: '10px' }}>Cancel</button>
                                <button type="submit" style={{ fontWeight: 'bold' }}>{isEditMode ? 'Save Changes' : 'Create'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ManageLabourListings;
