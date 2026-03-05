/*
 * @Author: your name
 * @Date: 2021-11-23 20:52:15
 * @LastEditTime: 2021-11-24 15:09:48
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /oss-imp-unicom/src/common/api/service/addLog.js
 */
import request from '@Src/common/api';
import useLoginInfoModel from '@Src/hox';
import dayjs from 'dayjs';
const log = async (data) => {
    await request('api/logs/operation', {
        data,
        baseUrlType: 'authorizeUrl',
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
    });
};
const logNew = async (operName, operationId) => {
    const { userName, userId, parsedUserInfo, systemInfo } = useLoginInfoModel.data;
    const { appId = '110002' } = systemInfo;

    const operationTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    localStorage.setItem('operId', operationId);

    const data = {
        appId,
        operationId: Number(operationId),
        userId,
        operationContent: `用户${userName} ${operationTime} 点击使用了oss-imp-unicom模块的${operName}功能`,
        operationTime,
        zoneId: parsedUserInfo?.zones[0]?.zoneId,
    };
    // const data = {
    //     appId: '110004',
    //     moduleId: '-1',
    //     operationId: Number(operationId),
    //     userId: userId,
    //     operationContent: `用户${userName} ${new Date().toISOString()}点击使用了oss-imp-unicom模块的${operName}功能`,
    //     operationTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    //     zoneId: userInfos?.zones[0]?.zoneId,
    //     logLevel: 2,
    //     clientType: 1,
    //     operationType: 10,
    //     userName: userName,
    // };
    await request('api/logs/operation/new', {
        data,
        baseUrlType: 'authorizeUrl',
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
    });
};
const logAddButton = async (data) => {
    const newData = {
        ...data,
        operationId: Number(data.operationId),
        operationTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    localStorage.setItem('operId', data.operationId);
    await request('api/logs/operation/new', {
        data: newData,
        baseUrlType: 'authorizeUrl',
        type: 'post',
        showSuccessMessage: false,
        showErrorMessage: false,
    });
};
export { log, logNew, logAddButton };
