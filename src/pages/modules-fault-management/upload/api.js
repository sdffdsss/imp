import request from '@Common/api';

/**
 * 大客户模板
 * @param {*} data
 * @returns
 */
const downloadBigCustomTemplate = (params) => {
    return request(`/networkFault/downFaultUniteTp`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
        data: params,
    });
};

/**
 * 核心网模板
 * @param {*} data
 * @returns
 */
const downloadCoreNetworkTemplate = () => {
    return request(`/networkFault/downFaultCoreTp`, {
        type: 'get',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        responseType: 'blob',
    });
};

/**
 * 大客户导入
 * @param {*} data
 * @returns
 */
const importBigCustom = (data) => {
    return request(`/networkFault/importFaultUnite?createdBy=${data.createdBy}&belongProvince=${data.belongProvince}&majorType=${data.majorType}`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: data.file,
    });
};

/**
 * 核心网导入
 * @param {*} data
 * @returns
 */
const importCoreNetwork = (data) => {
    return request(`/networkFault/importFaultCore?createdBy=${data.createdBy}&belongProvince=${data.belongProvince}&majorType=${data.majorType}`, {
        type: 'post',
        baseUrlType: 'dutyManagerUrl',
        showErrorMessage: false,
        showSuccessMessage: false,
        data: data.file,
    });
};

export default { downloadBigCustomTemplate, downloadCoreNetworkTemplate, importBigCustom, importCoreNetwork };
