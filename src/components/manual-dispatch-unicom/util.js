import _ from 'lodash';
/**
 * 生成右键操作数据
 *
 * @param {Array} actionRecords 操作告警数据
 * @param {Object} menu 当前右键菜单
 * @param {Array} recordsDetail 当前选中告警的详情
 * @param {Object} frameInfo 框架传递数据
 * @param {Object} formRef form表单实例
 * @return {Object} 返回右键操作data
 */
export const setRightClickData = ({ actionRecords, recordsDetail, frameInfo }) => {
    // const records = getRecordsRecursion(actionRecords, menu.isRelated);
    const recordsWithDetail = actionRecords.map((item) => {
        const detail = _.find(recordsDetail, (s) => s['alarm_id']?.value === item['alarm_id']?.value) || item;
        const detailValue = {};
        _.forOwn(detail, (value, key) => {
            detailValue[key] = value.value;
        });
        return detailValue;
    });
    const data = {
        operatorId: frameInfo.userId, //操作人ID
        operatorName: frameInfo.userName, //操作人名称
        loginId: frameInfo.loginId,
        requestInfo: {
            clientRequestId: 'nomean',
            clientToken: localStorage.getItem('access_token'),
        },
        clientRequestInfo: encodeURI(
            JSON.stringify({
                clientRequestId: 'nomean',
                clientToken: localStorage.getItem('access_token'),
            })
        ),
        alarmPropertiesList: recordsWithDetail,
        operateType: '',
    };
    if (menu.feedbackField && menu.feedbackField.length) {
        data.operateProps = {};
        _.forEach(menu.feedbackField, (field) => {
            data.operateProps[field] = formRef.current.getFieldValue(field);
            if ((field === 'reason' || field === 'memo') && !formRef.current.getFieldValue(field)) {
                data.operateProps[field] = '已阅读';
            }
        });
    }
    return data;
};
