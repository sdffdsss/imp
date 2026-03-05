/* eslint-disable consistent-return */
import request from '@Src/common/api';
import { _ } from 'oss-web-toolkits';
import { message } from 'oss-ui';

/**
 * 获取列状态
 * @param {*} userId
 * @returns
 */
const getColumnsStateByUserId = (frameInfo) => {
    return new Promise((resolve) => {
        request('common/queryColumnConfig', {
            type: 'get',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取列设置失败',
            data: {
                userId: frameInfo.userId,
                configType: 10,
            },
        }).then((res) => {
            resolve(res);
        });
    });
};

/**
 * 设置列状态
 * @param {*} userId
 * @returns
 */
const saveColumnsStateByUserId = (columns, frameInfo) => {
    return new Promise((resolve) => {
        request('common/saveColumnConfig', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '设置列设置失败',
            data: {
                columns,
                requestInfo: {
                    clientCommandType: 'getProfessional',
                    clientUserId: frameInfo.userId,
                },
                checkDataPower: 0,
            },
        }).then((res) => {
            resolve(res);
        });
    });
};

const getProfessionalEnum2Maintenance = (frameInfo) => {
    return new Promise((reslove) => {
        request('maintainTeam/interface', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取专业下拉选项数据失败，请检查服务',
            data: {
                requestInfo: {
                    clientCommandType: 'getProfessional',
                    clientUserId: frameInfo.userId,
                },
                checkDataPower: 0,
            },
        }).then((res) => {
            reslove(res);
        });
    });
};
const getProfessionalEnum3Maintenance = (frameInfo) => {
    return new Promise((reslove) => {
        request('maintainTeam/getCreatedProfessionalList', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取专业下拉选项数据失败，请检查服务',
            data: {
                requestInfo: {
                    clientCommandType: 'getProfessional',
                    clientUserId: frameInfo.userId,
                },
                checkDataPower: 0,
                provinceId: frameInfo.provinceId,
            },
        }).then((res) => {
            reslove(res);
        });
    });
};

const getProvinceEnum2Maintenance = (frameInfo) => {
    return new Promise((reslove) => {
        request('maintainTeam/interface', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份下拉选项数据失败，请检查服务',
            data: {
                requestInfo: {
                    clientCommandType: 'getProvince',
                    clientUserId: frameInfo.userId,
                },
            },
        }).then((res) => {
            reslove(res.data || []);
        });
    });
};

// 获取同步至集团选项
const getSyncJtType = (frameInfo) => {
    return new Promise((reslove) => {
        request('maintainTeam/interface', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份下拉选项数据失败，请检查服务',
            data: {
                requestInfo: {
                    clientCommandType: 'getSyncJtType',
                    clientUserId: frameInfo.userId,
                },
            },
        }).then((res) => {
            reslove(res.data || []);
        });
    });
};

const getMteamEnum2Maintenance = (params, frameInfo) => {
    return new Promise((reslove) => {
        request('maintainTeam/interface', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份下拉选项数据失败，请检查服务',
            data: {
                professionalId: params.professionalId,
                requestInfo: {
                    clientCommandType: 'getDimensions',
                    clientUserId: frameInfo.userId,
                },
            },
        }).then((res) => {
            reslove(res.data);
        });
    });
};

const getMaintainTeamList = (params, sorter, filter, frameInfo) => {
    if (
        (!params.provinceId &&
            params.provinceId !== 0 &&
            _.isEqual(params.provinceId, 0) &&
            !params.provinceIds &&
            params.provinceIds?.length === 0) ||
        (!params.professionalType && _.isEqual(params.professionalType, 0))
    )
        return;
    let orderType = '';
    let orderFieldName = '';
    if (!_.isEmpty(sorter)) {
        // 当排序的对象不为空时，取出对象的value
        orderType = Object.values(sorter).toString();
        if (orderType === 'ascend') {
            orderType = 'asc';
        } else {
            orderType = 'desc';
        }
        orderFieldName = Object.keys(sorter).toString();
    }
    return new Promise((reslove) => {
        request('maintainTeam/interface', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取列表数据失败，请检查服务',
            data: {
                provinceId: params.provinceId,
                provinceIds: frameInfo.systemInfo?.currentZone?.zoneLevel === '1' ? params.provinceIds : undefined,
                professionalId: params.professionalType,
                current: params.current,
                pageSize: params.pageSize,
                mteamName: params.mteamName,
                mteamModel: params.mteamModel,
                orderType,
                orderFieldName,
                requestInfo: {
                    clientCommandType: 'getList',
                    clientUserId: frameInfo.userId,
                },
            },
        }).then((res) => {
            let rowData = [];
            let total = 0;
            if (res) {
                total = res.total;
                rowData = res.data;
            }
            reslove({
                success: true,
                data: rowData,
                total,
            });
        });
    });
};

const saveMaintainTeam = (params, frameInfo, handlers) => {
    return request('maintainTeam/interface', {
        type: 'post',
        baseUrlType: 'maintainTeamUrl',
        showSuccessMessage: false,
        // defaultSuccessMessage: '新建班组成功',
        defaultErrorMessage: '新建班组失败，请检查服务！',
        data: {
            provinceId: params.provinceId,
            professionalId: params.professionalId,
            mteamName: params.mteamName,
            mteamModel: params.mteamModel,
            professionalName: params.professionalName,
            dimensions: params.dimensions,
            alarmsFieldsCond: params.alarmFiledsCond,
            alarmModelFilter: params.newFilterInfo, // 过滤器接口参数
            isSynBloc: params.isSynBloc,
            syncJtType: params?.syncJtType?.toString(),
            distributionModel: params?.distributionModel,
            requestInfo: {
                clientRequestId: 'string',
                clientToken: 'string',
                clientCommandType: 'insertTeam',
                clientUserId: frameInfo.userId,
            },
            jtGroupFlag: params.jtGroupFlag,
        },
        handlers: {
            params: handlers,
        },
    });
};

const updateMaintainTeam = (params, frameInfo, handlers) => {
    return request('maintainTeam/interface', {
        type: 'post',
        baseUrlType: 'maintainTeamUrl',
        showSuccessMessage: false,
        // defaultSuccessMessage: '更新班组成功',
        defaultErrorMessage: '更新班组失败，请检查服务！',
        data: {
            provinceId: params.provinceId,
            professionalId: params.professionalId,
            mteamName: params.mteamName,
            mteamModel: params.mteamModel,
            mteamId: params.mteamId,
            professionalName: params.professionalName,
            dimensions: params.dimensions,
            alarmsFieldsCond: params.alarmFiledsCond,
            alarmModelFilter: params.newFilterInfo, // 过滤器接口参数
            isSynBloc: params.isSynBloc,
            syncJtType: params?.syncJtType?.toString(),
            distributionModel: params?.distributionModel,
            requestInfo: {
                clientRequestId: 'string',
                clientToken: 'string',
                clientCommandType: 'updateTeam',
                clientUserId: frameInfo.userId,
            },
            jtGroupFlag: params.jtGroupFlag,
        },
        handlers: {
            params: handlers,
        },
    });
};

const deleteMaintainTeam = (params, frameInfo, handlers) => {
    return new Promise((reslove) => {
        request('maintainTeam/interface', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: true,
            defaultSuccessMessage: '删除班组成功',
            defaultErrorMessage: '删除班组失败，请检查服务！',
            data: {
                provinceId: params.provinceId,
                mteamId: params.mteamId,
                filterId: params.filterId,
                moduleId: params.moduleId,
                mteamModel: params.mteamModel,
                modelId: params.modelId,
                modifier: params.modifier,
                requestInfo: {
                    clientRequestId: 'string',
                    clientToken: 'string',
                    clientCommandType: 'deleteTeam',
                    clientUserId: frameInfo.userId,
                },
            },
            handlers: {
                params: handlers,
            },
        }).then((res) => {
            let rowData = [];
            let total = 0;
            if (res) {
                total = res.total;
                rowData = res.data;
            }
            reslove({
                success: true,
                data: rowData,
                total,
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

const onSaveFilterInfo = (filterInfo, modelType, login) => {
    return new Promise((reslove) => {
        let url = '';
        let method = '';
        const { userId } = login;
        if (filterInfo.filterExpr && _.isArray(filterInfo.filterExpr.filterConditionList) && filterInfo.filterExpr.filterConditionList.length === 0) {
            message.error(`请编辑条件`);
            return;
        }
        if (modelType === 'new') {
            method = 'post';
            url = 'alarmmodel/filter/v1/filter';
        }
        if (modelType === 'edit') {
            method = 'put';
            url = 'alarmmodel/filter/v1/filter';
            // eslint-disable-next-line no-param-reassign
            filterInfo.modifier = userId;
            // 修改时不传creator
            // eslint-disable-next-line no-param-reassign
            filterInfo = _.omit(filterInfo, ['creator']);
        }
        request(url, {
            type: method,
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '保存编辑条件数据失败，请检查服务',
            data: {
                alarmModelFilter: filterInfo,
                requestInfo: {
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                },
            },
        }).then((res) => {
            reslove({ success: true, data: res.data });
        });
    });
};

const onDeleteFilterInfo = (filterInfo) => {
    return new Promise((reslove) => {
        request('alarmmodel/filter/v1/filter', {
            type: 'delete',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '删除编辑条件数据失败，请检查服务',
            data: {
                filterId: filterInfo.filterId, // 过滤器ID
                moduleId: filterInfo.moduleId,
                modelId: filterInfo.modelId, // 所属模型ID
                requestInfo: {
                    clientRequestId: 'string',
                    clientToken: 'string',
                },
            },
        }).then((res) => {
            reslove({ success: true, data: res.data });
        });
    });
};

const getMteamSumStatistics = (data) => {
    return new Promise((reslove) => {
        request('maintainTeam/getMteamSumStatistics', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取班组统计数据失败，请检查服务',
            data,
        }).then((res) => {
            reslove({ success: true, data: res.data });
        });
    });
};

const getMteamBarStatistics = (data) => {
    return new Promise((reslove) => {
        request('maintainTeam/getMteamBarStatistics', {
            type: 'post',
            baseUrlType: 'maintainTeamUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取统计班组数据失败，请检查服务',
            data,
        }).then((res) => {
            reslove({ success: true, data: res.rows });
        });
    });
};

export {
    getColumnsStateByUserId,
    saveColumnsStateByUserId,
    getMaintainTeamList,
    saveMaintainTeam,
    updateMaintainTeam,
    deleteMaintainTeam,
    getProfessionalEnum2Maintenance,
    getProfessionalEnum3Maintenance,
    getProvinceEnum2Maintenance,
    getMteamEnum2Maintenance,
    getFilterInfo,
    onSaveFilterInfo,
    onDeleteFilterInfo,
    getSyncJtType,
    getMteamSumStatistics,
    getMteamBarStatistics,
};
