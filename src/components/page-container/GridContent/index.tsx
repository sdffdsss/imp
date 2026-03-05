import './index.less';

import type { CSSProperties } from 'react';
import React from 'react';
import classNames from 'classnames';

interface GridContentProps {
    contentWidth?: 'Fluid' | 'Fixed' | number;
    children: React.ReactNode;
    className?: string;
    style?: CSSProperties;
    prefixCls?: string;
}

/**
 * 可设置最小宽度
 * @param props
 */
const GridContent: React.FC<GridContentProps> = (props) => {
    const { children, contentWidth, className: propsClassName, style, prefixCls = 'oss-ui' } = props;
    let className = `${prefixCls}-grid-content`;
    if (contentWidth === 'Fixed') {
        className = `${prefixCls}-grid-content wide`;
    }
    return (
        <div className={classNames(className, propsClassName)} style={style}>
            <div className={`${prefixCls}-grid-content-children`}>{children}</div>
        </div>
    );
};

export default GridContent;
