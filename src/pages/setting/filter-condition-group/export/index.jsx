import React from 'react';
import { Icon, message, Tooltip } from 'oss-ui';
import { exportGroupNeData, batchExportGroupNeData } from '../utils/api';
import useLoginInfoModel, { useEnvironmentModel } from '@Src/hox';
import { withModel } from 'hox';
import AuthButton from '@Src/components/auth-button';
import { createFileFlow } from '@Common/utils/download';
const ExportComponent = (props) => {
    const { buttonType } = props;
    /**
     * @description: 导出数据
     * @param {*}
     * @return {*}
     */
    const handleExport = async () => {
        const { data, login, groupNetWorkType, groupType } = props;
        if (!Array.isArray(data) || data.length === 0) {
            message.error('请选择要导出的组');
            return;
        }
        try {
            const params = {
                excelType: 0,
                groupId: data,
                groupNetWorkType,
                groupType,
                userId: login.userId,
            };
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            submitExportRequest(params, 'batch');
        } catch (e) {
            message.error('出错了');
        }
    };

    /**
     * @description: 单独导出
     * @param {*}
     * @return {*}
     */
    const handleSingleExport = () => {
        const { data, login } = props;
        const params = {
            excelType: 0,
            groupId: data.groupId,
            groupNetWorkType: data.groupNetWorkType,
            groupType: data.groupType,
            userId: login.userId,
        };
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        submitExportRequest(params, 'single');
    };

    /**
     * @description: 发送导出请求
     * @param {*}
     * @return {*}
     */
    const submitExportRequest = async (params, type) => {
        try {
            let res = null;
            if (type === 'single') {
                res = await exportGroupNeData(params);
            } else {
                res = await batchExportGroupNeData(params);
            }
            if (res && res.data && res.data.filePath) {
                const url = `${useEnvironmentModel.data.environment.serviceDiscovery}/cloud.alarm.model.define${res.data.filePath}`;
                // window.open(url);
                createFileFlow(res.data.filePath, url);
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e);
        }
    };

    return buttonType === 'icon' ? (
        <Tooltip title="导出">
            <AuthButton onClick={handleSingleExport} type="text" style={{ padding: 0 }} authKey="networkGroup:export">
                <Icon antdIcon type="ExportOutlined" />
            </AuthButton>
        </Tooltip>
    ) : (
        <AuthButton type="primary" onClick={handleExport} authKey="networkGroup:batchExport">
            <Icon antdIcon type="ExportOutlined" />
            批量导出
        </AuthButton>
    );
};

export default withModel(useLoginInfoModel, (login) => ({
    login,
}))(ExportComponent);
