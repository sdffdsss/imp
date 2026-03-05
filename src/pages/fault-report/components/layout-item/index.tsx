import React, { useMemo } from 'react';
import './index.less';

interface Props {
    name?: string;
    value?: React.ReactNode;
    children?: React.ReactNode;
}

const LayoutItem: React.FC<Props> = ({ name, value, children }) => {
    // 检查 value 是否为空值
    const isEmptyValue = useMemo(() => {
        if (!value) return true;
        if (typeof value === 'string') {
            const trimmedValue = value.trim();
            return trimmedValue === '' || trimmedValue === '-' || trimmedValue === 'null' || trimmedValue === 'undefined';
        }
        return false;
    }, [value]);

    // 获取有效的 children
    const validChildren = useMemo(() => {
        return React.Children.toArray(children).filter(child => {
            if (child === false || child === null || child === undefined) {
                return false;
            }
            if (React.isValidElement(child)) {
                // 过滤掉空的 div 元素
                return !(child.type === 'div' && child.props.children === undefined);
            }
            return true;
        });
    }, [children]);

    // 确定显示内容
    const displayContent = useMemo(() => {
        if (!isEmptyValue) return value;
        if (validChildren.length > 0) return validChildren;
        if (name) return '未填写';
        return null;
    }, [isEmptyValue, value, validChildren, name]);

    if (displayContent === null) return null;

    return (
        <div className="fault-report-detail-layout-item">
            {name && <div className="fault-report-detail-layout-item-name">{name}</div>}
            <div className="fault-report-detail-layout-item-value">
                {displayContent}
            </div>
        </div>
    );
};

export default LayoutItem;
