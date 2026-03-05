import React from 'react';

interface IInlineEditProps {
    editable: boolean;
    editComponentSetting: {
        component?: React.ReactElement;
        [key: string]: any;
    };
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    record: Record<string, any>;
    index: number;
    children: React.ReactNode;
    inlineEditProps: IInlineEditProps;
    disabled: boolean;
    tableCompFunc: Record<string, any>;
}
