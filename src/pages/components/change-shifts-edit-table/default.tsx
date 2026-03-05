import React from 'react';
import { Input } from 'oss-ui';
import TitlePrefix from '@Pages/components/title-prefix';
import { RefreshDataServiceType } from './types';

export const defaultColumns = [
    {
        dataIndex: 'a',
        title: 'a',
        width: 140,
        inlineEditProps: {
            editable: true,
        },
    },
    {
        dataIndex: 'b',
        title: 'b',
        width: 140,
        inlineEditProps: {
            editable: true,
            renderComponent: <Input />,
        },
    },
];

export const defaultRowActions = [
    {
        type: 'edit',
        actionProps: {
            editMode: 'inline',
            handleCustomEdit: async () => {},
            handleEditConfirm: () => {},
        },
    },
    {
        type: 'view',
        actionProps: {
            handleView() {},
        },
    },
    {
        type: 'delete',
        actionProps: {
            handleDelete: async () => {},
        },
    },
];

export const defaultTitleRender = (
    <div style={{ display: 'inline-flex', lineHeight: 1 }}>
        <TitlePrefix style={{ marginRight: '10px' }} />
        网络故障
    </div>
);
export const defaultRefreshDataService: RefreshDataServiceType = () => {
    return new Promise((resolve) => {
        resolve({
            pagination: {
                current: 1,
                pageSize: 5,
                total: 4,
            },
            data: [
                {
                    a: '1',
                    b: '1',
                },
                {
                    a: '2',
                    b: '2',
                },
                {
                    a: '3',
                    b: '3',
                },
                {
                    a: '4',
                    b: '4',
                },
                {
                    a: '5',
                    b: '5',
                },
            ],
        });
    });
};
