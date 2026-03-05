import request from '@Common/api';
import { getRequestSessionId } from '../utils/common';

export const getTableData = (params, sorter, filters) => {
    return Promise.resolve({
        data: [],
        success: true,
    });
};

/**
 * @description: 获取专业组下专业列表数据
 * @param {*} data
 * @return {*}
 */
export const getGroupsData = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/searchGroups', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('searchGroups'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 获取专业下网元组数据
 * @param {*} data
 * @return {*}
 */
export const getGroupNetWorkList = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/searchSpecificNeIds', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('searchSpecificNeIds'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 获取左侧树的数据
 * @param {*} data
 * @return {*}
 */
export const getTreeData = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/leftListTrees', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('leftListTrees'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 新建专业组
 * @param {*} data
 * @return {*}
 */
export const addGroups = (data, params) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/addGroups', {
            type: 'post',
            defaultSuccessMessage: '保存数据成功',
            defaultErrorMessage: '保存数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('addGroups'),
                ...data,
            },
            handlers: {
                params,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 编辑专业组
 * @param {*}
 * @return {*}
 */
export const updateGroups = (data, params) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/updateGroups', {
            type: 'put',
            defaultSuccessMessage: '保存数据成功',
            defaultErrorMessage: '保存数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('updateGroups'),
                ...data,
            },
            handlers: {
                params,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 查询专业组表头字段
 * @param {*} data
 * @return {*}
 */
export const searchGroupFields = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/getNetWorkGroupField', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('getNetWorkGroupField'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 获取网元组下面的网元
 * @param {*} data
 * @return {*}
 */
export const searchSpecificNeIds = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/searchSpecificNeIds', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('searchSpecificNeIds'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 查询网元数据
 * @param {*} data
 * @return {*}
 */
export const searchAllNeIds = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/searchNeIds', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '获取数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('searchNeIds'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 删除网元组
 * @param {*}
 * @return {*}
 */
export const deleteNetWorkGroup = (data, params) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/deleteGroups', {
            type: 'delete',
            defaultSuccessMessage: '删除成功',
            defaultErrorMessage: '删除失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('deleteGroups'),
                ...data,
            },
            handlers: {
                params,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 下载模版
 * @param {*} data
 * @return {*}
 */
export const downLoadTemplate = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/operate/v1/downLoadTemplate', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '下载数据模版失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('exportGroupNeData'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 导出网元组功能
 * @param {*} data
 * @return {*}
 */
export const exportGroupNeData = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/operate/v1/exportGroupNeData', {
            type: 'post',
            defaultSuccessMessage: '导出数据成功',
            defaultErrorMessage: '导出数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('exportGroupNeData'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 批量导出接口
 * @param {*} data
 * @return {*}
 */
export const batchExportGroupNeData = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/operate/v1/batchExportGroupNeData', {
            type: 'post',
            defaultSuccessMessage: '导出数据成功',
            defaultErrorMessage: '导出数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('exportGroupNeData'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 上传文件
 * @param {*} data
 * @return {*}
 */
export const upLoadTemplate = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/operate/v1/importGroupNeData', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '上传文件失败',
            baseUrlType: 'netWorkManage',
            data,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
/**
 * @description: 更新网元组中的网元
 * @param {*} data
 * @return {*}
 */
export const updateGroupByElements = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/updateGroupByElements', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '更新数据失败',
            baseUrlType: 'netWorkManage',
            data,
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};
/**
 * @description: 获取应用
 * @param {*} data
 * @return {*}
 */
export const getGroupDictDataByType = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/getGroupDictDataByType', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '查询数据失败',
            baseUrlType: 'netWorkManage',
            data: {
                sessionId: getRequestSessionId('getGroupDictDataByType'),
                ...data,
            },
        })
            .then((res) => {
                resolve(res);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 编辑前鉴权
 * @param {*} data
 * @return {*}
 */
export const validatePermissionBeforeUpdate = (data) => {
    return new Promise((resolve, reject) => {
        request('networkGroup/query/v1/validatePermissionBeforeUpdate', {
            type: 'post',
            showSuccessMessage: false,
            defaultErrorMessage: '查询数据失败',
            baseUrlType: 'netWorkManage',
            data,
        })
            .then(() => {
                resolve(true);
            })
            .catch((e) => {
                reject(e);
            });
    });
};

/**
 * @description: 网元省份
 * @param {*} data
 * @return {*}
 */
export const getProvinceData = (userId) => {
    return request('group/findProvincesOnly', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: { creator: userId },
    });
};
// 获取地市列表
export const getRegionList = (data) => {
    return request('group/findProvinceRegions', {
        type: 'post',
        baseUrlType: 'groupUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data,
    });
};
