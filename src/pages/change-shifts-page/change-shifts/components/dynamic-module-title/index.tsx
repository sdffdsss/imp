import React from 'react';
import TitlePrefix from '@Pages/components/title-prefix';

export default function Title({ text }) {
    return (
        <div style={{ display: 'inline-flex', lineHeight: 1, alignItems: 'center' }}>
            <TitlePrefix style={{ marginRight: '8px', width: '4px', height: '16px' }} />
            <span>{text}</span>
        </div>
    );
}
