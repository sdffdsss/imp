import React, { useState, useRef, useEffect } from 'react';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import useLoginInfoModel from '@Src/hox';
import { Modal } from 'oss-ui';
import getColumns from './columns';
import { getAlarmOptimizationManagement, getProfessionalTypeList } from '../api';

const AlarmCopyModal = (props) => {
    const { isModalOpen, handleCopyOk, handleCancel } = props;

    const [professionalData, setProfessionalData] = useState([]);

    const { provinceId } = useLoginInfoModel();
    const formRef = useRef();

    const startFormat = 'YYYY-MM-DD 00:00:00';
    const endFormat = 'YYYY-MM-DD 23:59:59';
    let currentValue;

    const handleOk = () => {
        handleCopyOk(currentValue);
    };

    const onAlarmRowChange = (selectedRowKeys, selectedRows) => {
        currentValue = selectedRows?.[0];
    };

    // 重加载
    const tableRef = useRef();

    // 表格配置
    const columns = getColumns({
        provinceId: Number(provinceId),
        searchTime: [],
        professionalData,
    });

    // 获取告警优化管理列表数据
    const getAlarmOptimizationManagementList = (params, sort) => {
        let orderFlag = '';
        let fieldFlag = '';
        const sortFlag = Object.keys(sort);
        if (sortFlag.length > 0) {
            const fieldsName = sortFlag.toString();
            if (fieldsName === 'firstTime') {
                orderFlag = sort.firstTime === 'descend' ? 'desc' : 'asc';
                fieldFlag = 'first_time';
            } else if (fieldsName === 'clearTime') {
                orderFlag = sort.clearTime === 'descend' ? 'desc' : 'asc';
                fieldFlag = 'clear_time';
            } else if (fieldsName === 'lastTime') {
                orderFlag = sort.lastTime === 'descend' ? 'desc' : 'asc';
                fieldFlag = 'last_time';
            }
        } else {
            orderFlag = undefined;
            fieldFlag = undefined;
        }
        const data = {
            pageNum: params.current,
            pageSize: params.pageSize,
            provinceId: params.provinceId,
            professionIds: params.professionId?.join(','),
            alarmPlatform: params.alarmPlatform,
            alarmTitle: params.alarmTitle,
            alarmLevel: params.alarmLevel,
            optimizationFlag: params.optimizationFlag,
            optimizationCompleteFlag: params.optimizationCompleteFlag,
            firstTimeStart: params.firstTime?.[0] ? moment(params.firstTime?.[0]).format(startFormat) : undefined,
            firstTimeEnd: params.firstTime?.[1] ? moment(params.firstTime?.[1]).format(endFormat) : undefined,
            lastTimeStart: params.lastTime?.[0] ? moment(params.lastTime?.[0]).format(startFormat) : undefined,
            lastTimeEnd: params.lastTime?.[1] ? moment(params.lastTime?.[1]).format(endFormat) : undefined,
            clearTimeStart: params.clearTime?.[0] ? moment(params.clearTime?.[0]).format(startFormat) : undefined,
            clearTimeEnd: params.clearTime?.[1] ? moment(params.clearTime?.[1]).format(endFormat) : undefined,
            orderFieldName: fieldFlag,
            orderType: orderFlag,
        };
        return getAlarmOptimizationManagement(data);
    };

    // 获取监控班组专业属性
    const getProfessionalData = async () => {
        const res = await getProfessionalTypeList({});
        if (res && Array.isArray(res.data)) {
            const list = res.data;
            setProfessionalData(list);
        }
    };

    useEffect(() => {
        getProfessionalData();
    }, []);
    // 给表单项赋初始值
    useEffect(() => {
        formRef.current?.setFieldsValue({
            provinceId: Number(provinceId),
            searchTime: [],
            professionalData,
        });
        formRef.current?.submit();
    }, []);

    return (
        <>
            <Modal title="告警复制" visible={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000} destroyOnClose>
                <VirtualTable
                    global={window}
                    rowKey="id"
                    columns={columns}
                    request={getAlarmOptimizationManagementList}
                    actionRef={tableRef}
                    formRef={formRef}
                    style={{ height: 600 }}
                    scroll={{ x: 'max-content' }}
                    rowSelection={{
                        hideSelectAll: true,
                        onChange: onAlarmRowChange,
                        type: 'radio',
                    }}
                />
            </Modal>
        </>
    );
};

export default AlarmCopyModal;
