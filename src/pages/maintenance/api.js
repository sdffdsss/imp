import request from '@Src/common/api';
import { message } from 'oss-ui';
import { useEnvironmentModel } from '@Src/hox';
import { createFileFlow } from '@Common/utils/download';

const handleState = (result, cbSuccess, cbError) => {
    if (result) {
        if (cbSuccess) {
            cbSuccess(result);
        }
    } else if (cbError) {
        cbError(result);
    }
};

/** *
 *自定义文件上传
 */
const uploadSender = (params, cbSuccess, cbError) => {
    request('defaultSendor/importDefaultSender', {
        data: params,
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '上传失败',
        baseUrlType: 'maintenanceDownLoadUrl',
    })
        .then((result) => {
            handleState(
                result,
                (data) => {
                    cbSuccess(data);
                },
                (error) => {
                    cbError(error);
                },
            );
        })
        .catch((error) => {
            cbError(error);
        });
};

/** *
 *自定义文件上传
 */
const uploadScripts = (params, cbSuccess, cbError) => {
    request('eomsmaintain/banzuguanli/importAlarmresourceByEoms', {
        data: params,
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '上传失败',
        baseUrlType: 'maintenanceDownLoadUrl',
    })
        .then((result) => {
            handleState(
                result,
                (data) => {
                    cbSuccess(data);
                },
                (error) => {
                    cbError(error);
                },
            );
        })
        .catch((error) => {
            cbError(error);
        });
};
//下载模板
const uploadExport = (win) => {
    request('eomsmaintain/banzuguanli/createImportTemplate', {
        data: win,
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败',
        baseUrlType: 'groupUrl',
    }).then((result) => {
        message.success(result.message);
        if (result.fileurl) {
            // const link = document.createElement('a');
            // link.href = `${useEnvironmentModel.data.environment.groupUrl.direct}${result.fileurl}`; // window.URL.createObjectURL(result.fileurl);
            // 重命名导出文件
            // link.download = `维护值班表导出-${moment().format('YYYYMMDDHHmmss')}.xls`;
            // link.click();
            // window.URL.revokeObjectURL(link.href);
            const url = `${useEnvironmentModel.data.environment.groupUrl.direct}${result.fileurl}`;
            const str = result.fileurl.replace('/cloud-view-maintainteam/export/', '');
            return createFileFlow(str, url);
        }
    });
};
/**
 * 任务列表数据导出
 * @param {*} params
 * ! 弃用了。。。。大概
 */
const downLoad = (win) => {
    return new Promise((resolve, reject) => {
        request('eomsmaintain/banzuguanli/exportAlarmresourceByEoms', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '导出失败',
            baseUrlType: 'groupUrl',
            data: win,
        })
            .then((result) => {
                message.success(result.message);
                if (result.fileurl) {
                    // const link = document.createElement('a');
                    // link.href = `${useEnvironmentModel.data.environment.groupUrl.direct}${result.fileurl}`; // window.URL.createObjectURL(result.fileurl);
                    const url = `${useEnvironmentModel.data.environment.groupUrl.direct}${result.fileurl}`; // window.URL.createObjectURL(result.fileurl);
                    const str = result.fileurl.replace('/cloud-view-maintainteam/export/', '');
                    createFileFlow(str, url);
                    // 重命名导出文件
                    // link.download = `维护值班表导出-${moment().format('YYYYMMDDHHmmss')}.xls`;
                    // link.click();
                    // window.URL.revokeObjectURL(link.href);
                }
                resolve();
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * 包机导出
 * @param {*} params
 */
const downLoadbj = (win) => {
    return new Promise((resolve, reject) => {
        request('eomsmaintain/banzuguanli/exportAlarmresourceByEomsbj', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '导出失败',
            baseUrlType: 'groupUrl',
            data: win,
        })
            .then((result) => {
                message.success(result.message);
                if (result.fileurl) {
                    // const link = document.createElement('a');
                    // link.href = `${useEnvironmentModel.data.environment.groupUrl.direct}${result.fileurl}`; // window.URL.createObjectURL(result.fileurl);
                    // // 重命名导出文件
                    // // link.download = `维护值班表导出-${moment().format('YYYYMMDDHHmmss')}.xls`;
                    // link.click();
                    // window.URL.revokeObjectURL(link.href);
                    const url = `${useEnvironmentModel.data.environment.groupUrl.direct}${result.fileurl}`; // window.URL.createObjectURL(result.fileurl);
                    const str = result.fileurl.replace('/cloud-view-maintainteam/export/', '');
                    createFileFlow(str, url);
                    resolve();
                }
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * 接单人导出
 * @param {*} params
 */
const senderDownLoad = (win) => {
    request('defaultSendor/exportDefaultSender', {
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败',
        baseUrlType: 'groupUrl',
        data: win,
    }).then((result) => {
        message.success(result.message);
        if (result.fileurl) {
            // const link = document.createElement('a');
            // link.href = `${useEnvironmentModel.data.environment.groupUrl.direct}${result.fileurl}`; // window.URL.createObjectURL(result.fileurl);
            // // 重命名导出文件
            // // link.download = `维护值班表导出-${moment().format('YYYYMMDDHHmmss')}.xls`;
            // link.click();
            // window.URL.revokeObjectURL(link.href);
            const url = `${useEnvironmentModel.data.environment.groupUrl.direct}${result.fileurl}`; // window.URL.createObjectURL(result.fileurl);
            const str = result.fileurl.replace('/cloud-view-maintainteam/export/', '');
            return createFileFlow(str, url);
        }
    });
};

const getDictEntry = (dictName, userId) => {
    return Promise.resolve(
        request('alarmmodel/field/v1/dict/entry', {
            type: 'get',
            baseUrlType: 'filterUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取字典键值失败',
            data: {
                pageSize: 2500,
                dictName,
                en: false,
                modelId: 2,
                creator: userId,
                clientRequestInfo: JSON.stringify({
                    clientRequestId: 'nomean',
                    clientToken: localStorage.getItem('access_token'),
                }),
            },
        })
            .then((res) => {
                if (res && res.data && res.data.length) {
                    return res.data;
                }
                return [];
            })
            .catch(() => {
                return [];
            }),
    );
};
/**
 * @description: 获取省列表
 * @param {*}
 * @return {*}
 */
const getProvinceData = async (userId) => {
    return new Promise((reslove) => {
        request('group/findProvinces', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取省份数据失败',
            data: {
                creator: userId,
            },
        })
            .then((res) => {
                reslove(res);
            })
            .catch(() => {
                return [];
            });
    });
};
/**
 * @description: 获取地市列表
 * @param {*}
 * @return {*}
 */
const getProvinceRegions = (provinceId, userId, checkDataPower) => {
    return new Promise((reslove) => {
        request('group/findProvinceRegions', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            data: {
                parentRegionId: provinceId,
                creator: userId,
                checkDataPower: 0,
            },
        }).then((res) => {
            if (res && Array.isArray(res)) {
                const handleList = res;
                // handleList.unshift({
                //     regionId: '-1',
                //     regionName: '无',
                // });
                reslove(handleList);
            }
        });
    });
};
const getMaintenanceInfo = (data) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/queryAlarmResourceByeomsByCondition', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取维护值班表数据失败，请检查服务filterUrl',
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};
const getMaintenanceSenderInfo = (data) => {
    return new Promise((reslove) => {
        request('defaultSendor/queryDefaultSender', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取接单人数据失败，请检查服务',
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};
const getTeamInfo = (data) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/queryMainTainTeamInfo', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取班组数据失败，请检查服务filterUrl',
            data,
        }).then((res) => {
            reslove(res.rows);
        });
    });
};
const getDeptUserInfo = (data) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/queryDeptTree', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取部门人员数据失败，请检查服务filterUrl',
            data,
        }).then((res) => {
            reslove(res);
        });
    });
};
const updateMaintenanceInfo = (params, param) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/updateAlarmResourceBatch', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultSuccessMessage: '更新维护值班表数据成功',
            defaultErrorMessage: '更新维护值班表数据失败，请检查服务！',
            data: params,
            handlers: {
                params: param,
            },
        }).then((res) => {
            reslove(res);
        });
    });
};

const updateMaintenanceSenderInfo = (params, param) => {
    return new Promise((reslove) => {
        request('defaultSendor/updateDefaultSender', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: true,
            defaultSuccessMessage: '更新接单人数据成功',
            defaultErrorMessage: '更新接单人数据失败，请检查服务！',
            data: params,
            handlers: {
                params: param,
            },
        }).then((res) => {
            reslove(res);
        });
    });
};

// 获取待修改人员列表
const getOnDutyUsers = (params) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/getOnDutyUsers', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取待修改人员列表失败',
            data: params,
        }).then((res) => {
            reslove(res.rows);
        });
    });
};

// 获取交接的维护范围
const getScopeByUser = (params) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/getScopeByUser', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取维护范围失败',
            data: params,
        }).then((res) => {
            reslove(res.rows);
        });
    });
};

// 获取省市下所有人员
const queryDeptUserInfo = (params) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/queryDeptUserInfo', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取交接人员列表失败',
            data: params,
        }).then((res) => {
            reslove(res.rows);
        });
    });
};

// 批量修改人员
const updateDutyUserBatch = (params, param) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/updateDutyUserBatch', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: params,
            handlers: {
                params: param,
            },
        }).then((res) => {
            reslove(res);
        });
    });
};

// 获取不存在人员列表
const queryUnusedUserInfo = (params) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/queryUnusedUserInfo', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '获取不存在人员列表失败',
            data: params,
        }).then((res) => {
            reslove(res.rows);
        });
    });
};

// 获取导入状态
const importProcess = (params) => {
    return new Promise((reslove) => {
        request('eomsmaintain/banzuguanli/importProcess', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: params,
        })
            .then((res) => {
                if (res.progressShow !== null) {
                    reslove(res);
                } else {
                    reslove(null);
                }
            })
            .catch(() => {
                reslove(null);
            });
    });
};

// 批量排班 alarmResourceByeoms/updateWorkingScheduleBatch
const updateWorkingScheduleBatch = (params, param) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/updateWorkingScheduleBatch', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            showErrorMessage: false,
            data: params,
            handlers: {
                params: param,
            },
        })
            .then((res) => {
                reslove(res);
            })
            .catch(() => {
                reslove(null);
            });
    });
};

// 查询人员当天是否排班
const getUsersToday = (params) => {
    return new Promise((reslove) => {
        request('alarmResourceByeoms/getUsersToday', {
            type: 'post',
            baseUrlType: 'groupUrl',
            showSuccessMessage: false,
            defaultErrorMessage: '查询人员当天是否排班失败',
            data: params,
        }).then((res) => {
            reslove(res);
        });
    });
};

/**
 * @description: 获取角色列表
 */
const getRolesDictionary = () => {
    return request('dict/queryDict', {
        type: 'get',
        baseUrlType: 'fault',
        showSuccessMessage: false,
        defaultErrorMessage: '获取角色列表失败',
        data: {
            dictName: 'team_group_roles',
        },
    });
};
/**
 *
 * @param {*} data
 * @desc 新版导出 值班模式
 */
const exportAlarmresourceByEomsApi = (data) => {
    return request('eomsmaintain/banzuguanli/exportAlarmresourceByEoms', {
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败',
        baseUrlType: 'groupUrl',
        data,
    });
};
/**
 *
 * @param {*} data
 * @desc 新版导出 包机模式
 */
const exportAlarmresourceByEomsbjApi = (data) => {
    return request('eomsmaintain/banzuguanli/exportAlarmresourceByEomsbj', {
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败',
        baseUrlType: 'groupUrl',
        data,
    });
};
const exportProcessApi = (data) => {
    return request('eomsmaintain/banzuguanli/exportProcess', {
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '导出失败',
        baseUrlType: 'groupUrl',
        data,
    });
};
const professionalAndObjectTypesApi = (data) => {
    return request('sysadminAlarm/ProfessionalAndObjectTypes', {
        type: 'post',
        baseUrlType: 'filter',
        showSuccessMessage: false,
        data,
    });
};
/** *
 *自定义文件上传
 */
const uploadFileLog = (params, cbSuccess, cbError) => {
    request('api/logs/upload', {
        data: params,
        type: 'post',
        showSuccessMessage: false,
        defaultErrorMessage: '日志附件cos上传失败',
        baseUrlType: 'authorizeUrl',
    })
        .then((result) => {
            handleState(
                result,
                (data) => {
                    cbSuccess(data);
                },
                (error) => {
                    cbError(error);
                },
            );
        })
        .catch((error) => {
            cbError(error);
        });
};
export default {
    uploadScripts,
    downLoad,
    downLoadbj,
    getDictEntry,
    getProvinceData,
    getProvinceRegions,
    getTeamInfo,
    getDeptUserInfo,
    getMaintenanceInfo,
    updateMaintenanceInfo,
    getOnDutyUsers,
    getScopeByUser,
    queryDeptUserInfo,
    updateDutyUserBatch,
    queryUnusedUserInfo,
    importProcess,
    updateWorkingScheduleBatch,
    getMaintenanceSenderInfo,
    updateMaintenanceSenderInfo,
    senderDownLoad,
    uploadSender,
    getUsersToday,
    uploadExport,
    getRolesDictionary,
    exportAlarmresourceByEomsApi,
    exportAlarmresourceByEomsbjApi,
    exportProcessApi,
    professionalAndObjectTypesApi,
    uploadFileLog,
};
