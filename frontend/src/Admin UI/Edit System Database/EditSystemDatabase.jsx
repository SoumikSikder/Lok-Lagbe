import React, { useState, useEffect } from 'react';

/**
 * Base API URL for editing system database.
 */
const API_BASE = 'http://localhost:8000/api/admin/edit-database/';

/**
 * Simple React component for editing system database records.
 *
 * @param {Object} props Component properties
 * @returns {JSX.Element} Simple Edit System Database UI
 */
function EditSystemDatabase(props) {
    const [tables, setTables] = useState([]);
    const [selectedTable, setSelectedTable] = useState('users');
    const [records, setRecords] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [fieldData, setFieldData] = useState({});
    const [alert, setAlert] = useState(null);

    useEffect(() => {
        _fetchTables();
    }, []);

    useEffect(() => {
        if (selectedTable) {
            _fetchRecords(selectedTable);
        }
    }, [selectedTable]);

    /**
     * Fetches list of system database tables.
     */
    const _fetchTables = async () => {
        try {
            const res = await fetch(`${API_BASE}tables/`);
            const data = await res.json();
            if (res.ok && data.success) {
                setTables(data.data || []);
            }
        } catch (err) {
            _showAlert('Server or database connection fails.', 'error');
        }
    };

    /**
     * Fetches records for a selected table.
     *
     * @param {string} tableName Table identifier
     */
    const _fetchRecords = async (tableName) => {
        try {
            const res = await fetch(`${API_BASE}records/?table=${tableName}`);
            const data = await res.json();
            if (res.ok && data.success) {
                setRecords(data.data || []);
                setSelectedRecord(null);
            }
        } catch (err) {
            _showAlert('Server connection error.', 'error');
        }
    };

    /**
     * Displays alert notification message.
     *
     * @param {string} msg Text to display
     * @param {string} type Alert type ('success' or 'error')
     */
    const _showAlert = (msg, type = 'success') => {
        setAlert({ msg, type });
        setTimeout(() => setAlert(null), 4000);
    };

    /**
     * Selects a database record to view and edit.
     *
     * @param {Object} item Record object
     */
    const _handleSelectRecord = (item) => {
        setSelectedRecord(item);
        const initialFields = { ...item };
        delete initialFields.id;
        delete initialFields.password;
        delete initialFields.created_at;
        delete initialFields.updated_at;
        setFieldData(initialFields);
    };

    /**
     * Handles field value edit.
     *
     * @param {string} key Field name
     * @param {string} value Field value
     */
    const _handleFieldChange = (key, value) => {
        setFieldData((prev) => ({ ...prev, [key]: value }));
    };

    /**
     * Submits updated record information to API.
     *
     * @param {Event} e Submit event
     */
    const _handleUpdateSubmit = async (e) => {
        e.preventDefault();

        // Check for empty mandatory fields
        for (const k in fieldData) {
            if (fieldData[k] === null || fieldData[k] === '') {
                _showAlert(`Field '${k}' cannot be empty. Please complete all mandatory fields.`, 'error');
                return;
            }
        }

        try {
            const res = await fetch(`${API_BASE}record/update/`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    table: selectedTable,
                    id: selectedRecord.id,
                    fields: fieldData,
                }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                _showAlert('Database record has been updated successfully.', 'success');
                _fetchRecords(selectedTable);
                setSelectedRecord(null);
            } else {
                _showAlert(data.message || 'Database update fails.', 'error');
                if (res.status === 404) {
                    _fetchRecords(selectedTable);
                }
            }
        } catch (err) {
            _showAlert('Server or database connection fails. Please try again.', 'error');
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Edit System Database</h2>
            <p style={{ color: '#666' }}>
                Select a database table and record to edit system information.
            </p>

            {/* Notification Alert Banner */}
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

            {/* Table Selection Dropdown */}
            <div style={{ marginBottom: '15px' }}>
                <label><strong>Select Database Table: </strong></label>
                <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    style={{ padding: '8px', marginLeft: '10px' }}
                >
                    {tables.map((t) => (
                        <option key={t.table_key} value={t.table_key}>
                            {t.display_name} ({t.record_count} records)
                        </option>
                    ))}
                </select>
            </div>

            {/* Records List Table */}
            <table border="1" cellPadding="8" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ background: '#eee' }}>
                        <th>ID</th>
                        <th>Record Identifier / Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length === 0 ? (
                        <tr>
                            <td colSpan="3" style={{ textAlign: 'center' }}>No records found.</td>
                        </tr>
                    ) : (
                        records.map((r) => (
                            <tr key={r.id}>
                                <td>{r.id}</td>
                                <td>{r.username || r.name || r.email || `Record #${r.id}`}</td>
                                <td>
                                    <button onClick={() => _handleSelectRecord(r)}>
                                        Select & Edit
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Edit Record Form Modal */}
            {selectedRecord && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{ background: '#fff', padding: '20px', borderRadius: '5px', width: '450px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <h3>Edit Record #{selectedRecord.id} ({selectedTable})</h3>
                        <form onSubmit={_handleUpdateSubmit}>
                            {Object.keys(fieldData).map((key) => (
                                <div key={key} style={{ marginBottom: '10px' }}>
                                    <label><strong>{key}:</strong></label><br />
                                    <input
                                        type="text"
                                        value={fieldData[key]}
                                        onChange={(e) => _handleFieldChange(key, e.target.value)}
                                        style={{ width: '100%', padding: '6px' }}
                                    />
                                </div>
                            ))}
                            <div style={{ textAlign: 'right', marginTop: '15px' }}>
                                <button type="button" onClick={() => setSelectedRecord(null)} style={{ marginRight: '10px' }}>
                                    Cancel
                                </button>
                                <button type="submit" style={{ fontWeight: 'bold' }}>
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditSystemDatabase;
