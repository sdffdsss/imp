import React from 'react';

export default function Index({ label, value }) {
    return (
        <div className="success-item-content">
            <div className="success-item-content-label">{label}</div>
            <div className="success-item-content-content" title={value}>
                {value || '--'}
            </div>
        </div>
    );
}
