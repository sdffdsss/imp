import React, { CSSProperties } from 'react';
import './index.less';
import { Divider } from 'oss-ui';

interface Props {
    title: string;
    hideDivider?: boolean;
    extra?: React.ReactNode;
    subtitle?: React.ReactNode | string;
    faultReportDetailCardId?: string;
    extraStyle?: CSSProperties;
}

const ItemCard: React.FC<Props> = (props) => {
    const { title, children, hideDivider, extra, subtitle, faultReportDetailCardId, extraStyle } = props;
    return (
        <div className="fault-report-detail-card" id={faultReportDetailCardId}>
            <header>
                <div className="fault-report-detail-card-header-title">{title}</div>
                <div className="fault-report-detail-card-header-subtitle">{subtitle}</div>
                <div className="fault-report-detail-card-header-extra" style={extraStyle}>
                    {extra}
                </div>
            </header>
            <div className="fault-report-detail-card-content">{children}</div>
            {!hideDivider && <Divider dashed className="fault-report-detail-card-divider" />}
        </div>
    );
};

export default ItemCard;
