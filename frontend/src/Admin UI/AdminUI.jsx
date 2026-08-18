import React, { useState } from 'react';
import ManageLabourListings from './Manage Labour Listing/ManageLabourListings';

/**
 * Container component for the Admin UI layout.
 *
 * Provides navigation tab switching between Admin sub-features:
 * 1. Manage Labour Listing
 * 2. Edit System Database
 *
 * @param {Object} props Component properties
 * @returns {JSX.Element} Rendered AdminUI container component
 */
function AdminUI(props) {
    const [activeTab, setActiveTab] = useState('manage_labour');

    return (
        <div style={styles.adminWrapper}>
            <nav style={styles.navBar}>
                <div style={styles.brand}>
                    ⚡ Lok-Lagbe Admin Portal
                </div>
                <div style={styles.tabGroup}>
                    <button
                        type="button"
                        style={{
                            ...styles.tabBtn,
                            ...(activeTab === 'manage_labour' ? styles.activeTabBtn : {}),
                        }}
                        onClick={() => setActiveTab('manage_labour')}
                    >
                        📋 Manage Labour Listings
                    </button>
                    <button
                        type="button"
                        style={{
                            ...styles.tabBtn,
                            ...(activeTab === 'edit_db' ? styles.activeTabBtn : {}),
                        }}
                        onClick={() => setActiveTab('edit_db')}
                    >
                        🗄️ Edit System Database
                    </button>
                </div>
            </nav>

            <main style={styles.mainContent}>
                {activeTab === 'manage_labour' && <ManageLabourListings />}
                {activeTab === 'edit_db' && (
                    <div style={styles.placeholderBox}>
                        <h2>Edit System Database</h2>
                        <p style={{ color: '#6c757d' }}>
                            The System Database Editor module is ready to be populated.
                        </p>
                        <a
                            href="http://localhost:8000/admin/"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.djangoAdminLink}
                        >
                            🔗 Open Django Built-in Admin Portal
                        </a>
                    </div>
                )}
            </main>
        </div>
    );
}

const styles = {
    adminWrapper: {
        minHeight: '100vh',
        backgroundColor: '#f4f6f9',
        fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    },
    navBar: {
        backgroundColor: '#1e293b',
        color: '#ffffff',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    },
    brand: {
        fontSize: '20px',
        fontWeight: 'bold',
        letterSpacing: '0.5px',
    },
    tabGroup: {
        display: 'flex',
        gap: '8px',
    },
    tabBtn: {
        backgroundColor: 'transparent',
        color: '#cbd5e1',
        border: 'none',
        padding: '10px 18px',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        fontWeight: '500',
    },
    activeTabBtn: {
        backgroundColor: '#3b82f6',
        color: '#ffffff',
        fontWeight: 'bold',
    },
    mainContent: {
        padding: '32px 16px',
    },
    placeholderBox: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '8px',
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    djangoAdminLink: {
        display: 'inline-block',
        marginTop: '16px',
        backgroundColor: '#0f766e',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        textDecoration: 'none',
        fontWeight: 'bold',
    },
};

export default AdminUI;
