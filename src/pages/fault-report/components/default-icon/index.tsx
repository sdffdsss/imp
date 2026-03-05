import React from 'react';
import './index.less';

interface Props {
    type: string | number;
}

const DefaultIcon: React.FC<Props> = (props) => {
    const { children } = props;

    return (
        <div className="fault-report-icon">
            <div>{children}</div>
        </div>
    );
};

export default DefaultIcon;
