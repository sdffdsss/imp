import React from 'react';
import { _ } from 'oss-web-toolkits';
import { message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import api from '../../api';
import { getColumns } from './columns.js';

export const TableIndex = (props) => {
    const { professionDic, userId, provinceId } = props;
    const getData = async (params) => {
        // 表单搜索项会从 params 传入，传递给后端接口。

        const myParams = _.cloneDeep(params);

        return api
            .faultOperateHistoryList(myParams)
            .then(
                (res) => {
                    // console.log('***********************55555555555555555555');
                    return { data: res.data || [], success: true, total: res.total || 0 };
                },
                (error) => {
                    message.error(error);
                    // console.log('***********************888', error);
                    return {
                        data: [],
                        // success 请返回 true，
                        // 不然 table 会停止解析数据，即使有数据
                        success: false,
                        // 不传会使用 data 的长度，如果是分页一定要传
                        total: 0,
                    };
                },
            )
            .catch((e) => {
                message.error(e);
                return {
                    data: [],
                    // success 请返回 true，
                    // 不然 table 会停止解析数据，即使有数据
                    success: false,
                    // 不传会使用 data 的长度，如果是分页一定要传
                    total: 0,
                };
            });
    };
    return (
        <VirtualTable
            bordered
            defaultCollapsed
            global={window} // 必填项
            columns={getColumns(professionDic)}
            params={{ userId, provinceId }}
            request={getData}
            rowKey={(record) => record.id}
            size="small"
            tableAlertOptionRender={false}
            tableAlertRender={false}
            options={{ reload: false, setting: false, fullScreen: false }}
            form={{
                align: 'left',
                labelCol: { span: 6 },
            }}
            search={{
                span: 6,
            }}
        />
    );
};
