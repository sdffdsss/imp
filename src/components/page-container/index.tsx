import type { CSSProperties } from 'react';
import React from 'react';
import classNames from 'classnames';
import './index.less';
import GridContent from './GridContent';
import { Divider, PageHeader } from 'oss-ui';
import type { PageHeaderProps } from 'oss-ui/es/page-header';

export interface PageContainerProps extends Omit<PageHeaderProps, 'title'> {
    title?: React.ReactNode | false;
    content?: React.ReactNode;
    divider?: boolean;
    extraContent?: React.ReactNode;
    prefixCls?: string;
    ghost?: boolean;
    pageHeaderRender?: (props: PageContainerProps) => React.ReactNode;
    gridContentClassName?: string;
    gridContentStyle?: CSSProperties;
    showHeader?: boolean;
}

const renderPageHeader = (
    content: React.ReactNode,
    extraContent: React.ReactNode,
    prefixedClassName: string
): React.ReactNode => {
    if (!content && !extraContent) {
        return null;
    }
    return (
        <div className={`${prefixedClassName}-detail`}>
            <div className={`${prefixedClassName}-main`}>
                <div className={`${prefixedClassName}-row`}>
                    {content && <div className={`${prefixedClassName}-content`}>{content}</div>}
                    {extraContent && <div className={`${prefixedClassName}-extraContent`}>{extraContent}</div>}
                </div>
            </div>
        </div>
    );
};

const defaultPageHeaderRender = (props: PageContainerProps, value: any): React.ReactNode => {
    const { title, showHeader = true, content, pageHeaderRender, extraContent, style, prefixCls, ...restProps } = props;

    if (pageHeaderRender) {
        return pageHeaderRender({ ...props, ...value });
    }
    let pageHeaderTitle = title;
    if (!title && title !== false) {
        pageHeaderTitle = value.title;
    }

    return (
        showHeader && (
            <PageHeader {...value} title={pageHeaderTitle} {...restProps} prefixCls={prefixCls}>
                {renderPageHeader(content, extraContent, value.prefixedClassName)}
            </PageHeader>
        )
    );
};

const PageContainer: React.FC<PageContainerProps> = (props) => {
    const {
        children,
        style,
        ghost,
        divider = true,
        showHeader = true,
        prefixCls = 'oss-ui',
        gridContentClassName,
        gridContentStyle,
    } = props;
    const prefixedClassName = `${prefixCls}-page-container`;

    const className = classNames(prefixedClassName, props.className, {
        [`${prefixCls}-page-container-ghost`]: ghost,
        [`${prefixCls}-page-container-show-header-divider`]: showHeader && divider,
        [`${prefixCls}-page-container-show-header`]: !divider && showHeader,
    });

    return (
        <div style={style} className={className}>
            <div className={`${prefixedClassName}-wrap`}>
                {defaultPageHeaderRender(props, {
                    prefixCls: undefined,
                    prefixedClassName,
                })}
            </div>
            {showHeader && divider && <Divider style={{ margin: '0 0 8px 0' }} />}
            <GridContent className={gridContentClassName} style={gridContentStyle}>
                {children || null}
            </GridContent>
        </div>
    );
};

export default PageContainer;
