import React, { useState, useRef, useEffect } from 'react';
import { message } from 'oss-ui';
import { VirtualTable } from 'oss-web-common';
import moment from 'moment';
import { useHistory } from 'react-router-dom';
import useLoginInfoModel from '@Src/hox';
import shareActions from '@Src/share/actions';
import { getDefaultGroupByUser } from '@Pages/setting/views/group-manage/utils';
import { getProvinceList, getCenterListApi, getGroupListApi, getShiftOfDutyStatisticsData } from './api';
import getColumns from './columns';
import constants from '@Common/constants';

const StatisticalData = () => {
    const [groupData, setGroupData] = useState([]);
    const [provinceData, setProvinceData] = useState([]);
    const [centerData, setCenterData] = useState([]);
    const [pagination, setPagination] = useState({});

    const { userId, provinceId } = useLoginInfoModel();
    const { userInfo } = useLoginInfoModel.data;
    const { operations = [] } = JSON.parse(userInfo);
    const currProvince = provinceData.find((item) => item.regionId === provinceId);
    const formRef = useRef();

    const [groupInitial, setGroupInitial] = useState([]);
    const [loading, setLoading] = useState(true);
    const searchTime = [moment().subtract('day', 3), moment()];

    const history = useHistory();
    const pushActions = (url, label, search) => {
        // const hasAuth = operations?.find((item) => item.path === `/unicom${url}`);

        // if (!hasAuth) {
        //     message.warn(`您没有${label}的权限，请前往“功能角色”配置`);
        //     return;
        // }

        const { actions, messageTypes } = shareActions;
        if (actions && actions.postMessage) {
            actions.postMessage(messageTypes.openRoute, {
                entry: `/unicom${url}`,
                search: {
                    ...search,
                },
            });
        } else {
            const newUrl = `${url}?${new URLSearchParams(search).toString()}`;
            history.push(`/znjk/${constants.CUR_ENVIRONMENT}/unicom${newUrl}`);
        }
    };

    /**
     * 查看详情
     */
    const showViewClick = (record) => {
        const values = formRef.current?.getFieldsValue();
        const { dateTime } = values;
        const { groupId, groupName } = record;
        const beginDate = dateTime[0].format('YYYY-MM-DD');
        const endDate = dateTime[1].format('YYYY-MM-DD');
        pushActions('/setting/core/statistical-data/detail', '数据统计详情', { groupId, groupName, beginDate, endDate });
    };

    // 重加载
    const tableRef = useRef();

    /**
     * 获取列表数据
     * @param {*} params
     * @returns
     */
    const getStatisticalDataList = (params) => {
        setPagination({
            current: params.current,
            pageSize: params.pageSize,
        });
        console.log(params.groupId);
        const data = {
            pageNum: params.current,
            pageSize: params.pageSize,
            beginDate: params.dateTime[0] ? params.dateTime[0] : undefined,
            endDate: params.dateTime[1] ? params.dateTime[1] : undefined,
            centerId: params.monitorCenterId,
            provinceId: params.provinceId,
            groupIds: params.groupId?.length > 0 ? params.groupId : undefined,
        };
        return getShiftOfDutyStatisticsData(data);
    };

    // 表格配置
    const columns = getColumns({
        showViewClick,
        provinceId,
        currProvince,
        centerList: centerData,
        provinceList: provinceData,
        groupList: groupData,
        pagination,
        groupInitial,
    });

    /**
     * 获取班组名称列表
     */
    const getGroupList = async () => {
        const data = {
            provinceId,
        };
        const res = await getGroupListApi(data);
        if (res && Array.isArray(res.rows)) {
            const list = res.rows;
            setGroupData(list);
        }
    };

    /**
     * 获取归属省份
     */
    const getProvinceData = async () => {
        const data = {
            creator: userId,
        };
        const res = await getProvinceList(data);

        if (res && Array.isArray(res)) {
            const list = res;
            setProvinceData(list);
        }
    };

    /**
     * 获取监控中心数据
     */
    const getCenterData = async () => {
        const data = {
            provinceId,
            associatedGroupId: '',
        };

        const res = await getCenterListApi(data);

        if (res && Array.isArray(res.data)) {
            const list = res.data;
            setCenterData(list);
        }
    };

    /**
     * 重置
     */
    const onTableReset = async () => {
        formRef.current?.setFieldsValue({
            provinceId: Number(provinceId),
            dateTime: searchTime,
        });
        formRef.current?.submit();
    };

    useEffect(() => {
        getProvinceData();
        getCenterData();
        getGroupList();
    }, []);

    // 给表单项赋初始值
    useEffect(() => {
        getDefaultGroupByUser().then((res) => {
            setGroupInitial(res.groupId ? [res.groupId] : []);
            setLoading(false);
            formRef.current?.setFieldsValue({
                provinceId: Number(provinceId),
                dateTime: searchTime,
                groupId: res.groupId ? [res.groupId] : [],
            });
            formRef.current?.submit();
        });

        // formRef.current?.setFieldsValue({
        //     provinceId: Number(provinceId),
        //     dateTime: searchTime,
        // });
        // formRef.current?.submit();
    }, []);

    return (
        <>
            {!loading && (
                <VirtualTable
                    global={window}
                    columns={columns}
                    onReset={onTableReset}
                    request={getStatisticalDataList}
                    actionRef={tableRef}
                    formRef={formRef}
                    scroll={{ x: 'max-content' }}
                />
            )}
        </>
    );
};

export default StatisticalData;
