import React from 'react';

export default class Index extends React.PureComponent {
    renderAlramInTable(text) {
        let color = '#000';
        switch (text) {
            case 1:
                color = '#FF0000';
                break;
            case 2:
                color = '#FFA500';
                break;
            case 3:
                color = '#FFFF00';
                break;
            case 4:
                color = '#0000FF';
                break;
            default:
                color = null;
        }
        return <div style={{ width: '100%', backgroundColor: color }}>{text}</div>;
    }
}
