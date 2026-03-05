import React from 'react';
import classnames from 'classnames';
import TitlePrefix from '@Pages/components/title-prefix';
import './index.less';

export default function Index({ className, moduleId, title, titleSuffix, extra, children }) {
    const cls = classnames('change-shifts-common-wrapper', {
        [className]: !!className,
    });
    return (
        <div className={cls} data-moduleid={moduleId}>
            <div className="change-shifts-common-header">
                <div style={{ display: 'inline-flex', lineHeight: 1, alignItems: 'center' }}>
                    <TitlePrefix style={{ marginRight: '8px', width: '4px', height: '16px' }} />
                    <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{title}</span>
                    {titleSuffix}
                </div>
                {extra}
            </div>
            <div className="children-block">{children}</div>
        </div>
    );
}
