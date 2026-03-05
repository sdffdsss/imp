import request from '@Src/common/api';
import getData from '@Common/services/dataService';
import { _ } from 'oss-web-toolkits';
import { message } from 'oss-ui';

const maintainTeamColumns = [
    // { dataIndex: 'rowKey', key: 'rowKey', hideInTable: true },
    // { dataIndex: 'mteamId', key: 'mteamId', hideInTable: true },
    // { dataIndex: 'professionalId', key: 'professionalId', hideInTable: true },
    // { dataIndex: 'provinceId', key: 'provinceId', hideInTable: true },
    { title: '专业名称', ellipsis: true, dataIndex: 'professionalName', key: 'professionalName', width: 50 },
    { title: '省份名称', ellipsis: true, dataIndex: 'provinceName', key: 'provinceName', width: 50 },
    { title: '班组名称', ellipsis: true, dataIndex: 'mteamName', key: 'mteamName', width: 70 },
    { title: '班组维度', ellipsis: true, dataIndex: 'dimensions', key: 'dimensions', width: 70 },
    { title: '告警判别字段', ellipsis: true, dataIndex: 'alarmsFieldsCond', key: 'alarmsFieldsCond', width: 100 },
    // { title: '创建人', ellipsis: true, dataIndex: 'creator', key: 'creator', width: 60 },
    // { title: '创建时间', ellipsis: true, dataIndex: 'createTime', key: 'createTime', width: 80, valueType: 'dateTime' },
    // { title: '最后修改人', ellipsis: true, dataIndex: 'modifier', key: 'modifier', width: 60 },
    // { title: '最后修改时间', ellipsis: true, dataIndex: 'latestTime', key: 'latestTime', width: 80, valueType: 'dateTime' },
].map((item) => {
    return {
        ...item,
        align: 'center',
        hideInSearch: true,
    };
});

const maintainTeamColumnsRight = [
    { title: '专业名称', ellipsis: true, dataIndex: 'professionalName', key: 'professionalName', width: 50 },
    { title: '省份名称', ellipsis: true, dataIndex: 'provinceName', key: 'provinceName', width: 50 },
    { title: '班组名称', ellipsis: true, dataIndex: 'mteamName', key: 'mteamName', width: 70 },
    { title: '班组模式', ellipsis: true, dataIndex: 'mteamModelName', key: 'mteamModelName', width: 70 },
    { title: '班组维度', ellipsis: true, dataIndex: 'dimensions', key: 'dimensions', width: 70 },
    { title: '告警判别字段', ellipsis: true, dataIndex: 'alarmsFieldsCond', key: 'alarmsFieldsCond', width: 100 },
    { title: '优先级', render: (text, reocrd, index) => index + 1, width: 100 },
].map((item) => {
    return {
        ...item,
        align: 'center',
        hideInSearch: true,
    };
});

const moduleTeamId = 62;
const modeTeamlId = 2;
const getProfessionalEnum2Maintenance = (userId) => {
    return new Promise((reslove) => {
        request('maintainTeam/interface', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取专业下拉选项数据失败，请检查服务',
            data: {
                requestInfo: {
                    clientCommandType: 'getProfessional',
                    clientUserId: userId,
                },
            },
        }).then((res) => {
            reslove(res.data);
        });
    });
};

const getProvinceEnum2Maintenance = (userId) => {
    return new Promise((reslove) => {
        request('maintainTeam/interface', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份下拉选项数据失败，请检查服务',
            data: {
                requestInfo: {
                    clientCommandType: 'getProvince',
                    clientUserId: userId,
                },
            },
        }).then((res) => {
            reslove(res.data);
        });
    });
};
const getMaintainTeamList = (params, userId) => {
    return new Promise((reslove) => {
        request('maintainTeam/interface', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: false,
            data: {
                provinceId: params.provinceId,
                professionalId: params.professionalId,
                current: params.current,
                pageSize: params.pageSize,
                mteamModel: params.mteamModel,
                requestInfo: {
                    clientCommandType: 'getList',
                    clientUserId: userId,
                },
                checkDataPower: 0,
                // checkDataPower: params.checkDataPower === 0 ? 0 : 1,
            },
        }).then((res) => {
            let rowData = [];
            let total = 0;
            if (res && res.data) {
                total = res.total;
                rowData = res.data.map((item) => {
                    return {
                        ...item,
                        key: item.mteamId,
                        neId: item.mteamId,
                    };
                });
            }
            reslove({
                success: true,
                data: rowData,
                total,
                message: res.message,
                messFlag: !res.data,
            });
        });
    });
};
const getFilterInfo = (data) => {
    return new Promise((reslove) => {
        request('alarmmodel/filter/v1/filter', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取编辑条件数据失败，请检查服务',
            data,
        }).then((res) => {
            reslove(res.data);
        });
    });
};
const getFilterMteamList = (filterId) => {
    return new Promise((reslove) => {
        request('maintainTeam/getFilterMteamList', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取自动派单关联表失败，请检查服务',
            data: {
                filterId,
            },
        }).then((res) => {
            reslove(res.data);
        });
    });
};
// 备注：code为0表示成功，1表示失败。
// 后端操作是先删除后插入，如果输入参数中没有mteams参数数据，则只做删除。
const saveFilterMteam = (data) => {
    return new Promise((reslove) => {
        request('maintainTeam/saveFilterMteam', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '保存自动派单关联表失败，请检查服务',
            data,
            // data: {
            //     filterId: filterId,
            //     mteams: [
            //        {
            //             mteamId: 1618408895744,
            //         },
            //         {
            //             mteamId: 1618408771257,
            //         },
            //         {
            //             mteamId: 1618361124987,
            //         },
            //     ],
            // },
        }).then((res) => {
            reslove(res.code);
        });
    });
};
export {
    maintainTeamColumns,
    maintainTeamColumnsRight,
    moduleTeamId,
    modeTeamlId,
    getProfessionalEnum2Maintenance,
    getProvinceEnum2Maintenance,
    getMaintainTeamList,
    getFilterInfo,
    saveFilterMteam,
    getFilterMteamList,
};
